import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Box, ChipOption, Typography, theme } from "@/design-system";
import { getServicesStyles } from './services/services.styles';
import { LocationPanel } from "@/features/wall/components/LocationPanel";
import { ServicePost } from "../components/ServicePost";
import { CancelService } from "../components/CancelService";
import { RateService } from "../components/RateService";
import { AuthStackNavigationProp } from "@/assembler/navigation/types";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useGetCategoriesQuery } from "@/infrastructure/services/api";
import { useGetMyBookServicesQuery } from "../store/services.api";
import { BookService } from "../store";
import { getWallStyles } from "@/features/wall/screens/wall/wall.style";

interface Location {
    id: string;
    name: string;
}

// Datos mock para servicios
/* const mockServices: ServiceData[] = [
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
]; */

export const ServicesScreen = () => {
    const [locationPanelVisible, setLocationPanelVisible] = useState(false);
    const [cancelServiceVisible, setCancelServiceVisible] = useState(false);
    const [rateServiceVisible, setRateServiceVisible] = useState(false);
    const { data: categoriesData, error: categoriesError } = useGetCategoriesQuery({ language: 'en' });
    const { data: bookServices = [], isLoading: isLoadBookServices, error: bookServicesError } = useGetMyBookServicesQuery();

    const [currentLocation, setCurrentLocation] = useState<Location>({ id: '1', name: 'Miami, FL' });
    const navigation = useNavigation<AuthStackNavigationProp>();
    const bookings: BookService[] = bookServices;

    const categories: ChipOption[] =
    categoriesData?.categories?.map((c: any) => ({
        id: c.id,
        label: c.name,
    })) ?? [];

    const getCategoryOptions = useMemo(() => {
        return (categoryIds: string[]): ChipOption[] => {
            if (!categories || categories.length === 0) {
            return [];
            }
            
            return categoryIds
            .map(id => {
                const category = categories.find((cat: ChipOption) => cat.id === id);
                return category ? { id: category.id, label: category.label } : null;
            })
            .filter(Boolean) as ChipOption[];
        };
    }, [categories]);

    useEffect(() => {
        if (categoriesError) {
            Toast.show({
            type: 'error',
            text1: 'Error al cargar categorías',
            text2: (categoriesError as any)?.message ?? 'No se pudieron cargar las categorías.',
            });
        }
    }, [categoriesError]);

    useEffect(() => {
        if (bookServicesError) {
            Toast.show({
            type: 'error',
            text1: 'Error al cargar servicios',
            text2: (bookServicesError as any)?.message ?? 'No se pudieron cargar los servicios.',
            });
        }
    }, [bookServicesError]);

    // Filtrar servicios por estado
    const pendingServices = bookings.filter(service => service.status === 'pending');
    const completedServices = bookings.filter(service => service.status === 'completed');

    const handleSelectLocation = (location: Location) => {
        setCurrentLocation(location);
    };

    const handleCancelServicePress = () => {
        setCancelServiceVisible(true);
    }

    const handleRateServicePress = () => {
        setRateServiceVisible(true);
    };

    const navigateToChat = (service: BookService) => {
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
                                {pendingServices.length > 0 && !isLoadBookServices && (
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
                                {completedServices.length > 0 && !isLoadBookServices && (
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
                                {bookings.length === 0 && !isLoadBookServices && (
                                    <Box alignItems="center" justifyContent="center" padding="xl">
                                    <Typography variant="bodyLarge" color={theme.colors.colorGrey200}>
                                        No tienes servicios disponibles
                                    </Typography>
                                    </Box>
                                )}
                                
                                { isLoadBookServices && (
                                    <Box marginTop="lg" style={getWallStyles.loadingContainer}>
                                        <ActivityIndicator size="large" color={theme.colors.colorBrandPrimary} />
                                        <Typography variant="bodyMedium" color="white" style={getWallStyles.loadingText}>
                                            Loading your services...
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