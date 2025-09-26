import { useState, useRef, useEffect } from "react";
import { 
    Image, 
    ImageSourcePropType,
    ScrollView,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    View,
    TouchableWithoutFeedback,
    Alert
} from "react-native";
import { Box, Button, Input, SafeContainer, Typography, theme } from "@/design-system";
import { getChatStyles } from './chat/chat.styles';
import images from "@/assets/images/images";
import { Row } from "@/design-system/components/layout/Row/Row";
import { BookService } from "@/features/services/store";
import { Messages } from "../components/Messages";
import { Notification } from "../components/Notification";
import { ChatMessage } from "../slices/chat.slice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUpdateBookServiceStatusMutation } from "@/features/services/store/services.api";

export const ChatScreen = () => {
    const router = useRouter();
    const { post } = useLocalSearchParams<{ post?: string }>();
    const servicePost: BookService | null = post ? JSON.parse(post) : null;

    const [updateBookServiceStatus, { isLoading: isLoadUpdateBookServiceSta }] = useUpdateBookServiceStatusMutation();

    const [isAccepted, setIsAccepted] = useState(servicePost?.status === 'accepted');
    const [isRejected, setIsRejected] = useState(servicePost?.status === 'rejected');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);
    
    // Animaciones para los botones
    const buttonsOpacity = useRef(new Animated.Value(1)).current;
    
    // Detectar cuando se activa/desactiva el teclado
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                if (isAccepted) {
                    scrollToBottom();
                }
            }
        );
        
        return () => {
            keyboardDidShowListener.remove();
        };
    }, [isAccepted]);

    // Función para hacer scroll al final
    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleGoBackPress = () => router.back();
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleAccept = async () => {
        if (!servicePost?.id) {
            Alert.alert('Error', 'Service ID not found');
            return;
        }

        try {
            console.log('Aceptando servicio ID:', servicePost.id);
            
            await updateBookServiceStatus({
                id: servicePost.id,
                status: 'accepted'
            }).unwrap();
            
            // Animación para ocultar botones
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
            console.log('Rechazando servicio ID:', servicePost.id);
            
            await updateBookServiceStatus({
                id: servicePost.id,
                status: 'rejected'
            }).unwrap();
            
            // Animación para ocultar botones
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

    const handleSendMessage = () => {
        if (message.trim() === '' || !isAccepted) return;
        
        // Añadir mensaje enviado (del usuario)
        const userMessage: ChatMessage = {
            text: message,
            isReceived: false
        };
        
        setMessages([...messages, userMessage]);
        setMessage('');
        
        setTimeout(() => {
            // Simular una respuestas
            const responseOptions = [
                "Thank you for your message! I'll get back to you soon.",
                "I understand. I'll take care of that right away.",
                "Great! I'm looking forward to our appointment.",
                "Thank you very much! I remain attentive to any news..."
            ];
            
            const responseIndex = Math.floor(Math.random() * responseOptions.length);
            const responseMessage: ChatMessage = {
                text: responseOptions[responseIndex],
                isReceived: true 
            };
            
            setMessages(prevMessages => [...prevMessages, responseMessage]);
            scrollToBottom();
        }, 1000);
        
        scrollToBottom();
    };

    const handleInputFocus = () => {
        if (isAccepted) {
            scrollToBottom();
        }
    };

    // Mostrar los botones solo si el estado es 'pending' y el usuario es el proveedor
    const showActionButtons = servicePost?.status === 'pending' && servicePost?.bookingType === 'provider';

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
                        {servicePost?.bookingType === 'provider' ? 'User' : 'Provider'}
                    </Typography>
                    <Typography variant="bodyMedium" color={theme.colors.colorGrey100}>
                        {servicePost?.client.name}
                    </Typography>
                </Box>
                
                <Box width={60}>
                    {servicePost?.image && (
                        <Image
                            source={servicePost.image as ImageSourcePropType}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20
                            }}
                        />
                    )}
                </Box>
            </Row>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'black' }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
                <Box flex={1}>
                    <ScrollView 
                        ref={scrollViewRef}
                        style={getChatStyles.scrollView}
                        contentContainerStyle={[
                            getChatStyles.scrollContent,
                            isAccepted ? { paddingBottom: 30 } : {}
                        ]}
                        showsVerticalScrollIndicator={isAccepted}
                        scrollEnabled={isAccepted}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        onScrollBeginDrag={isAccepted ? dismissKeyboard : undefined}
                    >
                        {/* Notification for service details */}
                        <Notification title="¡Notificación!">
                            <Box>
                                <Box marginBottom="md">
                                    <Typography variant="bodyRegular" color="white">
                                        New request for <Typography variant="bodyBold" color="white">{servicePost?.client.name}!</Typography>
                                    </Typography>
                                </Box>
                                
                                <Box paddingLeft="sm">
                                    <Typography variant="bodyRegular" color="white">• Service: {servicePost?.serviceName}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Date: {servicePost?.dateShort}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Time: {servicePost?.timeShort}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Place: {servicePost?.address}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Contact number: {servicePost?.phoneNumber}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Description:</Typography>
                                    <Box marginTop="sm">
                                        <Typography variant="bodyRegular" color="white">
                                            {servicePost?.comments}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Notification>
                        
                        {/* Botones de Accept/Reject - Solo mostrar si está pending y es proveedor */}
                        {showActionButtons && (
                            <Animated.View 
                                style={{
                                    opacity: buttonsOpacity,
                                    position: isAccepted || isRejected ? 'absolute':'relative',
                                    top: 40,
                                    overflow: 'hidden',
                                    marginBottom: theme.spacing.sm,
                                }}
                            >
                                <Box width="100%" gap="lg">
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
                        
                        {/* Mensaje de aceptación */}
                        {isAccepted && (
                            <Notification title="¡Notificación!">
                                <Typography variant="bodyRegular" color="white">
                                    {servicePost?.bookingType === "client"
                                    ? "Your request has been accepted by the provider. You can now chat with them."
                                    : "You have accepted this request. You can now chat with the user." }
                                </Typography>
                            </Notification>
                        )}

                        {/* Mensaje de rechazo */}
                        {isRejected && (
                            <Notification title="¡Notificación!">
                                <Typography variant="bodyRegular" color="white">
                                    {servicePost?.bookingType === "client"
                                    ? "Sorry, the service has been rejected by the provider, we recommend you try another provider!"
                                    : "You have rejected this service request."}
                                </Typography>
                            </Notification>
                        )}
                        
                        <TouchableWithoutFeedback onPress={dismissKeyboard}>
                            <View>
                                {messages.map((msg, index) => (
                                    <Messages
                                        key={`msg-${index}`}
                                        text={msg.text}
                                        isReceived={msg.isReceived}
                                        image={
                                        msg.isReceived
                                            ? servicePost?.image as ImageSourcePropType
                                            : images.profile1 as ImageSourcePropType
                                        }
                                    />
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </Box>
                
                <Box marginBottom="xl">
                    <Input
                        icon="send"
                        label="Write your message"
                        value={message}
                        onChangeText={setMessage}
                        variant={isAccepted ? "chat" : "disabled"}
                        editable={isAccepted}
                        expandable={true} 
                        maxHeight={120}
                        returnKeyType="default"
                        onSubmitEditing={handleSendMessage}
                        onIconPress={handleSendMessage}
                        onFocus={handleInputFocus}
                    />
                </Box>
            </KeyboardAvoidingView>
        </SafeContainer>
    );
};