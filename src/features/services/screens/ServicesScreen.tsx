import { useState } from "react";
import { Image, ImageSourcePropType, TouchableOpacity, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Box, SafeContainer, Typography, theme } from "@/design-system";
import { Row } from "@/design-system/components/layout/Row/Row";
import { getWallStyles } from '@/features/wall/screens/wall/wall.style';
import { getServicesStyles } from './services/services.styles';
import images from "@/assets/images/images";
import { Icon, IconName } from "@/design-system/components/layout/Icon";
import { LocationPanel } from "@/features/wall/components/LocationPanel";
import { ServicePost } from "../components/ServicePost";
import { ServiceData } from "../slices/services.slice";
import { CancelService } from "../components/CancelService";
import { RateService } from "../components/RateService";
import { AuthStackNavigationProp } from "@/assembler/navigation/types";
import { useNavigation } from "@react-navigation/native";

interface Location {
    id: string;
    name: string;
}

// Datos mock para servicios
const mockServices: ServiceData[] = [
    {
        id: "1",
        category: "Painter",
        name: "Darius Robinson",
        role: 'user',
        date: "21 Apr",
        time: "2:00 PM EST",
        image: images.profile1 as ImageSourcePropType,
        address: "S Miami Ave Miami, FL 33129 3251",
        status: 'pending',
        chipOption: {
            id: "painter",
            label: "Painter",
            icon: "painter" as IconName
        },
        selectedChipId: "painter",
        phone: "408 234 7654",
        description: "I need to paint three rooms with different colors. I have all the paints ready."
    },
    {
        id: "2",
        category: "Babysister",
        name: "Alexa Jonasson",
        role: 'user',
        date: "10 Mar",
        time: "2:00 PM EST",
        image: images.profile3 as ImageSourcePropType,
        address: "S Miami Ave Miami, FL 33129 3251",
        status: 'completed',
        chipOption: {
            id: "babysister",
            label: "Babysister",
            icon: "smile" as IconName
        },
        selectedChipId: "babysister",
        phone: "305 123 4567",
        description: "Childcare for two kids for 4 hours. They are 3 and 5 years old."
    },
    {
        id: "3",
        category: "Painter",
        name: "Garry Calvin",
        role: 'provider',
        date: "10 Mar",
        time: "8:00 AM EST",
        image: images.profile2 as ImageSourcePropType,
        address: "S Miami Ave Miami, FL 33129 3251",
        status: 'pending',
        chipOption: {
            id: "babysister",
            label: "Babysister",
            icon: "smile" as IconName
        },
        selectedChipId: "babysister",
        phone: "786 987 6543",
        description: "Request to watch my children while I'm in an important meeting."
    },
    {
        id: "4",
        category: "Babysister",
        name: "Daniela Calvin",
        role: 'provider',
        date: "10 Mar",
        time: "8:00 AM EST",
        image: images.profile3 as ImageSourcePropType,
        address: "S Miami Ave Miami, FL 33129 3251",
        status: 'completed',
        chipOption: {
            id: "babysister",
            label: "Babysister",
            icon: "smile" as IconName
        },
        selectedChipId: "babysister",
        phone: "305 555 1234",
        description: "Pet sitting services needed during the weekend."
    },
];

export const ServicesScreen = () => {
    const [locationPanelVisible, setLocationPanelVisible] = useState(false);
    const [cancelServiceVisible, setCancelServiceVisible] = useState(false);
    const [rateServiceVisible, setRateServiceVisible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location>({ id: '1', name: 'Miami, FL' });
    const [services, setServices] = useState<ServiceData[]>(mockServices);
    const navigation = useNavigation<AuthStackNavigationProp>();

    // Filtrar servicios por estado
    const pendingServices = services.filter(service => service.status === 'pending');
    const completedServices = services.filter(service => service.status === 'completed');

    const handleSelectLocation = (location: Location) => {
        setCurrentLocation(location);
    };

    const handleCancelServicePress = () => {
        setCancelServiceVisible(true);
    }

    const handleRateServicePress = () => {
        setRateServiceVisible(true);
    };

    const navigateToChat = (service: ServiceData) => {
        navigation.navigate('Chat', { service });
    };

    const renderSectionHeader = (title: string) => (
        <Box>
            <Typography variant="bodyMedium" color={theme.colors.colorGrey200}>
                {title}
            </Typography>
        </Box>
    );

    return (
        <>
            <Box height="100%">
            <ScrollView
                style={getServicesStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={getServicesStyles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableWithoutFeedback onPress={() => {}}>
                <View>
                    <Box gap="md">
                    {/* Servicios pendientes */}
                    {pendingServices.length > 0 && (
                        <Box gap="md">
                        {renderSectionHeader('Pending Services')}
                        {pendingServices.map(service => (
                            <Box key={service.id}>
                            <ServicePost
                                servicePost={service}
                                onCancel={handleCancelServicePress}
                                onDetail={() => navigateToChat(service)}
                            />
                            </Box>
                        ))}
                        </Box>
                    )}

                    {/* Servicios completados */}
                    {completedServices.length > 0 && (
                        <Box gap="md">
                        {renderSectionHeader('Services Completed')}
                        {completedServices.map(service => (
                            <Box key={service.id}>
                            <ServicePost
                                servicePost={service}
                                onRate={handleRateServicePress}
                            />
                            </Box>
                        ))}
                        </Box>
                    )}

                    {/* Mensaje si no hay servicios */}
                    {services.length === 0 && (
                        <Box alignItems="center" justifyContent="center" padding="xl">
                        <Typography variant="bodyLarge" color={theme.colors.colorGrey200}>
                            No tienes servicios disponibles
                        </Typography>
                        </Box>
                    )}
                    </Box>
                </View>
                </TouchableWithoutFeedback>
            </ScrollView>
            </Box>

            <LocationPanel
            visible={locationPanelVisible}
            onClose={() => setLocationPanelVisible(false)}
            onSelectLocation={handleSelectLocation}
            currentLocation={currentLocation}
            />

            <CancelService
            visible={cancelServiceVisible}
            onClose={() => setCancelServiceVisible(false)}
            />

            <RateService
            visible={rateServiceVisible}
            onClose={() => setRateServiceVisible(false)}
            />
        </>
        );
};