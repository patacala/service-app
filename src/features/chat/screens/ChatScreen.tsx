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
    TouchableWithoutFeedback
} from "react-native";
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Box, Button, Input, SafeContainer, Typography, theme } from "@/design-system";
import { getChatStyles } from './chat/chat.styles';
import images from "@/assets/images/images";
import { Row } from "@/design-system/components/layout/Row/Row";
import { AuthStackParamList } from "@/assembler/navigation/types";
import { ServiceData } from "@/features/services/slices/services.slice";
import { Messages } from "../components/Messages";
import { Notification } from "../components/Notification";
import { ChatMessage, ChatScreenProps } from "../slices/chat.slice";
type ChatScreenRouteProp = RouteProp<AuthStackParamList, 'Chat'>;

export const ChatScreen = (service: ChatScreenProps) => {
    const navigation = useNavigation();
    const route = useRoute<ChatScreenRouteProp>();
    const [isAccepted, setIsAccepted] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);
    
    // Animaciones para los botones
    const buttonsOpacity = useRef(new Animated.Value(1)).current;
    
    // Recuperamos el servicio de los props o de la ruta
    const servicePost = (route.params?.service as ServiceData);

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

    const handleGoBackPress = () => navigation.goBack();

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleAccept = () => {
        console.log('Acción Accept para servicio ID:', servicePost?.id);
        
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
    };

    const handleReject = () => {
        console.log('Acción Reject para servicio ID:', servicePost?.id);
        
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
                        {servicePost?.role === 'provider' ? 'User' : servicePost.category}
                    </Typography>
                    <Typography variant="bodyMedium" color={theme.colors.colorGrey100}>
                        {servicePost.name}
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
                {/* El problema es que TouchableWithoutFeedback captura los eventos de toque y no permite el scroll */}
                {/* Usaremos un enfoque diferente para permitir scroll solo cuando isAccepted es true */}
                <Box flex={1}>
                    <ScrollView 
                        ref={scrollViewRef}
                        style={getChatStyles.scrollView}
                        contentContainerStyle={[
                            getChatStyles.scrollContent,
                            isAccepted ? { paddingBottom: 30 } : {} // Añadir padding extra solo si está aceptado
                        ]}
                        showsVerticalScrollIndicator={isAccepted}
                        scrollEnabled={isAccepted} // Solo habilitado cuando se acepta la solicitud
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag" // Mejor experiencia de usuario
                        onScrollBeginDrag={isAccepted ? dismissKeyboard : undefined} // Solo si está aceptado
                    >
                        {/* Notification for service details */}
                        <Notification title="¡Notificación!">
                            <Box>
                                <Box marginBottom="md">
                                    <Typography variant="bodyRegular" color="white">
                                        New request for <Typography variant="bodyBold" color="white">{servicePost.name}!</Typography>
                                    </Typography>
                                </Box>
                                
                                <Box paddingLeft="sm">
                                    <Typography variant="bodyRegular" color="white">• Service: {servicePost.category}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Date: {servicePost.date}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Time: {servicePost.time}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Place: {servicePost.address}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Contact number: {servicePost.phone}</Typography>
                                    <Typography variant="bodyRegular" color="white">• Description:</Typography>
                                    <Box marginTop="sm">
                                        <Typography variant="bodyRegular" color="white">
                                            {servicePost?.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Notification>
                        
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
                                    label="Accept Request"
                                    onPress={handleAccept}
                                />

                                <Button
                                    variant="slide"
                                    label="Reject"
                                    leftIcon="clear"
                                    onPress={handleReject}
                                />
                            </Box>
                        </Animated.View>
                        
                        {/* Mensaje de aceptación */}
                        {isAccepted && (
                            <Notification title="¡Notificación!">
                                <Typography variant="bodyRegular" color="white">
                                    You have accepted this request. You can now chat with the user.
                                </Typography>
                            </Notification>
                        )}

                        {/* Mensaje de rechazo */}
                        {isRejected && (
                            <Notification title="¡Notificación!">
                                <Typography variant="bodyRegular" color="white">
                                    Sorry, the service has been rejected by the provider, we recommend you try another provider!
                                </Typography>
                            </Notification>
                        )}
                        
                        {/* Agregar un TouchableWithoutFeedback dentro del ScrollView para manejar toques */}
                        <TouchableWithoutFeedback onPress={dismissKeyboard}>
                            <View>
                                {messages.map((msg, index) => (
                                    <Messages
                                        key={`msg-${index}`}
                                        text={msg.text}
                                        isReceived={msg.isReceived}
                                        image={
                                        msg.isReceived
                                            ? servicePost.image as ImageSourcePropType
                                            : images.profile1 as ImageSourcePropType
                                        }
                                    />
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </Box>
                
                <Box marginBottom="md">
                    <Input
                        icon="send"
                        label="Write your message"
                        value={message}
                        onChangeText={setMessage}
                        variant={isAccepted ? "default" : "disabled"}
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