import { useState, useRef, useEffect } from "react";
import { 
    Image, 
    ImageSourcePropType,
    ScrollView,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert
} from "react-native";
import { Box, Button, SafeContainer, Typography, theme } from "@/design-system";
import { getChatStyles } from './chat/chat.styles';
import images from "@/assets/images/images";
import { Row } from "@/design-system/components/layout/Row/Row";
import { BookService } from "@/features/services/store";
import { Messages } from "../components/Messages";
import { Notification } from "../components/Notification";
import { ChatMessage } from "../slices/chat.slice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUpdateBookServiceStatusMutation } from "@/features/services/store/services.api";
import { ChatInput } from "@/design-system/components/forms/ChatInput";
import { useGetMessagesQuery, useCreateMessageMutation } from "@/features/messages/store/messages.api";
import { useUploadImageMutation, useDeleteImageMutation } from "@/features/media/store/media.api";
import { supabase } from '@/lib/supabase';
import { MediaDto } from "@/features/messages/store/messages.types";

export const ChatScreen = () => {
    const router = useRouter();
    const { post } = useLocalSearchParams<{ post?: string }>();
    const [uploadImage] = useUploadImageMutation();
    const [deleteImage] = useDeleteImageMutation();

    let servicePost: BookService | null = null;
    try {
        servicePost = post ? JSON.parse(post) : null;
    } catch (error) {
        console.error('Error parsing post data:', error);
    }

    if (!servicePost) {
        useEffect(() => {
            Alert.alert('Error', 'Service data not found', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        }, []);
        
        return (
            <SafeContainer fluid backgroundColor="colorBaseBlack" paddingHorizontal="md">
                <Box flex={1} justifyContent="center" alignItems="center">
                    <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
                        Loading...
                    </Typography>
                </Box>
            </SafeContainer>
        );
    }

    const bookServiceId = servicePost.id;
    const currentUserId = servicePost.bookingType === 'provider'
        ? servicePost.provider?.id
        : servicePost.client?.id;

    const [updateBookServiceStatus, { isLoading: isLoadUpdateBookServiceSta }] = useUpdateBookServiceStatusMutation();
    const [createMessage] = useCreateMessageMutation();

    const [isAccepted, setIsAccepted] = useState(servicePost.status === 'accepted');
    const [isRejected, setIsRejected] = useState(servicePost.status === 'rejected');
    const [isCancelled, setIsCancelled] = useState(servicePost.status === 'cancelled');
    const [isCompleted, setIsCompleted] = useState(servicePost.status === 'completed');
    const isChatBlocked = isRejected || isCancelled || isCompleted;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);
    const buttonsOpacity = useRef(new Animated.Value(1)).current;
    const channelRef = useRef<any>(null);
    const messagesLoadedRef = useRef(false);

    const { data: serverMessages = [], isLoading: isLoadingMessages } = useGetMessagesQuery(
        { bookServiceId: bookServiceId },
        { skip: !bookServiceId }
    );

    const getProfileImage = (
        senderId: string,
        servicePost: BookService
    ) => {
        const isProviderSender = senderId === servicePost.provider?.id;

        if (isProviderSender) {
            return servicePost.provider?.media?.profileThumbnail?.url ?? null;
        }

        return servicePost.client?.media?.profileThumbnail?.url ?? null;
    };


    useEffect(() => {
        if (!bookServiceId || !currentUserId) return;

        const channel = supabase
            .channel(`chat_${bookServiceId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'BookServiceMessage',
                    filter: `book_service_id=eq.${bookServiceId}`,
                },
                (payload) => {
                    const newMsg = payload.new;
                    
                    if (newMsg.sender_id === currentUserId) {
                        return;
                    }

                    const imageProfile = getProfileImage(newMsg.sender_id, servicePost);
                    setMessages(prev => {
                        const messageExists = prev.some(m => m.text === newMsg.message);
                        
                        if (messageExists) {
                            return prev;
                        }

                        return [...prev, {
                            text: newMsg.message,
                            isReceived: true,
                            imageProfile,
                        }];
                    });
                    scrollToBottom();
                }
            )
            .subscribe();

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [bookServiceId, currentUserId]);

    useEffect(() => {
        if (serverMessages.length > 0 && currentUserId && !messagesLoadedRef.current) {
            const formatted = serverMessages.map((msg: any) => {
                const isReceived = msg.senderId !== currentUserId;
                const imageProfile = getProfileImage(msg.senderId, servicePost);

                return {
                    text: msg.message,
                    isReceived,
                    imageProfile,
                    mediaFiles: msg.media || [],
                };
            });
            setMessages(formatted);
            messagesLoadedRef.current = true;
            scrollToBottom();
        }
    }, [serverMessages, currentUserId]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', scrollToBottom);
        return () => keyboardDidShowListener.remove();
    }, []);

    useEffect(() => {
        if (servicePost) {
            setIsAccepted(servicePost.status === 'accepted');
            setIsRejected(servicePost.status === 'rejected');
            setIsCancelled(servicePost.status === 'cancelled');
            setIsCompleted(servicePost.status === 'completed');
        }
    }, [servicePost]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleGoBackPress = () => router.back();
    const dismissKeyboard = () => Keyboard.dismiss();

    const handleAccept = async () => {
        if (!servicePost?.id) {
            Alert.alert('Error', 'Service ID not found');
            return;
        }

        try {
            await updateBookServiceStatus({
                id: servicePost.id,
                status: 'accepted'
            }).unwrap();

            Animated.parallel([
                Animated.timing(buttonsOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setIsAccepted(true);
                scrollToBottom();
            });
        } catch (error) {
            console.error('Error accepting service:', error);
            Alert.alert('Error', 'Failed to accept the service. Please try again.');
        }
    };

    const handleReject = async () => {
        if (!servicePost?.id) {
            Alert.alert('Error', 'Service ID not found');
            return;
        }

        try {
            await updateBookServiceStatus({
                id: servicePost.id,
                status: 'rejected'
            }).unwrap();

            Animated.parallel([
                Animated.timing(buttonsOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setIsRejected(true);
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to reject the service. Please try again.');
        }
    };

    const handleSendMessage = async (payload?: { text: string; image: string | null }) => {
        if (isChatBlocked || !bookServiceId || !currentUserId) return;

        const textToSend = payload?.text ?? message.trim();
        const imageLocalUri = payload?.image ?? null;

        if (!textToSend && !imageLocalUri) return;

        const imageProfile = getProfileImage(currentUserId, servicePost);
        const tempMessage: ChatMessage = {
            text: textToSend,
            localImage: imageLocalUri,
            remoteImage: null,
            isReceived: false,
            uploading: !!imageLocalUri,
            failed: false,
            imageProfile
        };

        setMessages(prev => [...prev, tempMessage]);
        setMessage("");
        scrollToBottom();

        let uploadedImageId: string | null = null;

        try {
            let mediaToSend: MediaDto[] | undefined = undefined;

            // Si hay imagen, subirla primero
            if (imageLocalUri) {
                try {
                    const uploaded = await uploadImage({ 
                        file: { 
                            uri: imageLocalUri, 
                            name: `chat-${Date.now()}.jpg`, 
                            type: "image/jpeg" 
                        } 
                    }).unwrap();

                    if (uploaded.id && uploaded.variants) {
                        uploadedImageId = uploaded.id;
                        
                        mediaToSend = [{
                            filename: `chat-${Date.now()}.jpg`,
                            id: uploaded.id,
                            downloaded: false,
                            kind: 'image',
                            variants: uploaded.variants
                        }];

                        // Actualizar mensaje temporal con la imagen subida
                        setMessages(prev =>
                            prev.map(m =>
                                m === tempMessage
                                    ? {
                                        ...m,
                                        uploading: false,
                                        remoteImage: uploaded.url ?? null,
                                        failed: false
                                    }
                                    : m
                            )
                        );
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                    setMessages(prev =>
                        prev.map(m =>
                            m === tempMessage
                                ? {
                                    ...m,
                                    uploading: false,
                                    failed: true
                                }
                                : m
                        )
                    );
                    return;
                }
            }

            await createMessage({
                bookServiceId,
                message: textToSend,
                media: mediaToSend
            }).unwrap();

        } catch (error) {
            console.error("Error sending message:", error);
            
            if (uploadedImageId) {
                try {
                    await deleteImage(uploadedImageId).unwrap();
                } catch (deleteError) {
                    console.error('Error deleting uploaded image:', deleteError);
                }
            }

            setMessages(prev =>
                prev.map(m => (m === tempMessage ? { ...m, failed: true, uploading: false } : m))
            );
        }
    };

    const handleInputFocus = () => {
        scrollToBottom();
    };

    const showActionButtons = servicePost.status === 'pending' && servicePost.bookingType === 'provider';
    return (
        <SafeContainer fluid backgroundColor="colorBaseBlack" paddingHorizontal="md">
            <Box style={getChatStyles.backgroundImageContainer}>
                <Image
                    source={images.gradientBlueAndPurpleTop as ImageSourcePropType}
                    resizeMode="contain"
                    style={getChatStyles.backgroundImage}
                />
            </Box>

            <Row alignItems="center" justifyContent="space-between" marginTop="xl" marginBottom="xl" height={60}>
                <Box width={60} height={60} justifyContent="center" alignItems="center">
                    <Button
                        label=""
                        centerIcon="chevron-left"
                        onPress={handleGoBackPress}
                        variant="centerIconOnly"
                    />
                </Box>
    
                <Box justifyContent="center" alignItems="center">
                    <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
                        {servicePost.bookingType === 'provider' ? 'User' : 'Provider'}
                    </Typography>
                    <Typography variant="bodyMedium" color={theme.colors.colorGrey100}>
                        {servicePost.bookingType === 'provider' ? servicePost.client?.name : servicePost.provider?.name}
                    </Typography>
                </Box>
                
                <Box width={60}>
                    {servicePost.bookingType === 'provider' && servicePost.client?.media?.profileThumbnail?.url ? (
                        <Image
                            source={{ uri: servicePost.client.media.profileThumbnail.url }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                            }}
                        />
                    ) : servicePost.provider?.media?.profileThumbnail?.url ? (
                        <Image
                            source={{ uri: servicePost.provider.media.profileThumbnail.url }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                            }}
                        />
                    ) : null}
                </Box>
            </Row>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
            >
                <Box flex={1}>
                    <ScrollView 
                        ref={scrollViewRef}
                        style={getChatStyles.scrollView}
                        contentContainerStyle={[
                            getChatStyles.scrollContent,
                            { paddingBottom: 30 }
                        ]}
                        showsVerticalScrollIndicator={true}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        onScrollBeginDrag={dismissKeyboard}
                    >
                        <Notification title="¡Notificación!">
                            <Box>
                                <Box marginBottom="md">
                                    <Typography variant="bodyRegular" color="white">
                                        New request for <Typography variant="bodyBold" color="white">{servicePost.client?.name}!</Typography>
                                    </Typography>
                                </Box>
                                
                                <Box paddingLeft="sm">
                                    <Typography variant="bodyRegular" color="white">• Service: {servicePost.serviceName}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Date: {servicePost.dateShort}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Time: {servicePost.timeShort}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Place: {servicePost.address}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Contact number: {servicePost.phoneNumber}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Description:</Typography>
                                    <Box marginTop="sm">
                                        <Typography variant="bodyRegular" color="white">
                                            {servicePost.comments}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Notification>
                        
                        {showActionButtons && (
                            <Animated.View 
                                style={{
                                    opacity: buttonsOpacity,
                                    position: isAccepted || isRejected ? 'absolute':'relative',
                                    top: 5,
                                    overflow: 'hidden',
                                    marginBottom: theme.spacing.sm,
                                }}
                            >
                                <Box width="100%" gap="md">
                                    <Button
                                        variant="secondary"
                                        label={isLoadUpdateBookServiceSta ? "Processing..." : "Accept Request"}
                                        onPress={handleAccept}
                                        disabled={isLoadUpdateBookServiceSta}
                                    />

                                    <Button
                                        variant="slide"
                                        label={isLoadUpdateBookServiceSta ? "Processing..." : "Reject"}
                                        leftIcon="clear"
                                        onPress={handleReject}
                                        disabled={isLoadUpdateBookServiceSta}
                                    />
                                </Box>
                            </Animated.View>
                        )}
                        
                        {isAccepted && (
                            <Notification title="¡Notificación!">
                                <Typography variant="bodyRegular" color="white">
                                    {servicePost.bookingType === "client"
                                    ? "Your request has been accepted by the provider. You can now chat with them."
                                    : "You have accepted this request. You can now chat with the user." }
                                </Typography>
                            </Notification>
                        )}

                        {isRejected && (
                            <Notification title="¡Notificación!">
                                <Typography variant="bodyRegular" color="white">
                                    {servicePost.bookingType === "client"
                                    ? "Sorry, the service has been rejected by the provider, we recommend you try another provider!"
                                    : "You have rejected this service request."}
                                </Typography>
                            </Notification>
                        )}

                        {isLoadingMessages && (
                            <Box width="100%" alignItems="center" marginTop="lg">
                                <ActivityIndicator size="large" color="#fff" />
                            </Box>
                        )}
                        
                        {!isLoadingMessages && (
                            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                                <Box marginTop="lg">
                                    {messages.map((msg, index) => (
                                        <Messages
                                            key={`msg-${index}`}
                                            text={msg.text}
                                            isReceived={msg.isReceived}
                                            imageProfile={msg.imageProfile}
                                            localImage={msg.localImage}
                                            remoteImage={msg.remoteImage}
                                            mediaFiles={msg.mediaFiles}
                                            uploading={msg.uploading}
                                            failed={msg.failed}
                                        />
                                    ))}
                                </Box>
                            </TouchableWithoutFeedback>
                        )}
                    </ScrollView>
                </Box>
                
                <ChatInput
                    value={message}
                    onChangeText={setMessage}
                    onIconPress={handleSendMessage}
                    onSubmitEditing={handleSendMessage}
                    onFocus={handleInputFocus}
                    onImageSelected={scrollToBottom}
                    editable={!isChatBlocked}
                    maxHeight={120}
                    label=""
                    placeholder="Write your message"
                />
            </KeyboardAvoidingView>
        </SafeContainer>
    );
};
