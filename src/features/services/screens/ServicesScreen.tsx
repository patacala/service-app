import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Box, ChipOption, Typography, theme } from "@/design-system";
import { getServicesStyles } from './services/services.styles';
import { LocationPanel } from "@/features/wall/components/LocationPanel";
import { ServicePost } from "../components/ServicePost";
import { CancelService } from "../components/CancelService";
import { RateService } from "../components/RateService";
import { useGetCategoriesQuery } from "@/infrastructure/services/api";
import { useGetMyBookServicesQuery } from "../store/services.api";
import { BookService } from "../store";
import { getWallStyles } from "@/features/wall/screens/wall/wall.style";
import { getDeviceLanguage } from "@/assembler/config/i18n";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useAuth } from "@/infrastructure/auth/AuthContext";

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
    const { t } = useTranslation('auth');
    const router = useRouter();
    const { user } = useAuth();
    const [locationPanelVisible, setLocationPanelVisible] = useState(false);
    const [cancelServiceVisible, setCancelServiceVisible] = useState(false);
    const [rateServiceVisible, setRateServiceVisible] = useState(false);
    const { data: categoriesData, error: categoriesError } = useGetCategoriesQuery({ language: getDeviceLanguage() }, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const { data: bookServices, isLoading: isLoadBookServices, isFetching: isFetchingBookServices, error: bookServicesError } = useGetMyBookServicesQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const [currentLocation, setCurrentLocation] = useState<Location>({ id: '1', name: 'Miami, FL' });

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
            text1: t("messages.msg25"),
            text2: t("messages.msg26"),
            });
        }
    }, [categoriesError]);

    useEffect(() => {
        if (bookServicesError) {
            Toast.show({
            type: 'error',
            text1: t("services.msgerrorrservices"),
            text2: t("services.msgcouldrservices"),
            });
        }
    }, [bookServicesError]);

    // Filtrar servicios por tipo de usuario
    const otherBookings: BookService[] =
    isLoadBookServices || isFetchingBookServices
        ? []
        : bookServices?.otherBookings ?? [];

    const myBookings: BookService[] =
    isLoadBookServices || isFetchingBookServices
        ? []
        : bookServices?.myBookings ?? [];

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
        router.push({
            pathname: '/chat',
            params: { 
                post: JSON.stringify(service) 
            }
        });
    };

    const renderSectionHeader = (title: string) => (
        <Box>
            <Typography variant="bodyMedium" color={theme.colors.colorGrey200}>
                {title}
            </Typography>
        </Box>
    );

    const renderLoadSection = () => {
        if (isLoadBookServices || isFetchingBookServices) {
            return (
            <Box marginTop="lg" style={getWallStyles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.colorBrandPrimary} />
            </Box>
            );
        }
        return null;
    };

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
                                {/* Solicitudes de Mis Servicios */}
                                {user?.role === "both" && (
                                    <>
                                    {renderSectionHeader(t("services.servicerequests") + ':')}
                                    {renderLoadSection()}

                                    {otherBookings.length > 0 && !isLoadBookServices && (
                                    <Box gap="md">
                                        {otherBookings.map(service => {
                                        const serviceOptions = getCategoryOptions(service.categories || []);

                                        return (
                                            <Box key={service.id}>
                                            <ServicePost
                                                bookService={service}
                                                serviceOptions={serviceOptions}
                                                onCancel={handleCancelServicePress}
                                                onDetail={() => navigateToChat(service)}
                                            />
                                            </Box>
                                        );
                                        })}

                                        {(isLoadBookServices || isFetchingBookServices) && (
                                        <Box marginTop="lg" style={getWallStyles.loadingContainer}>
                                            <ActivityIndicator
                                            size="large"
                                            color={theme.colors.colorBrandPrimary}
                                            />
                                        </Box>
                                        )}
                                    </Box>
                                    )}
                                </>
                                )}

                                {/* Servicios Contratados */}
                                {renderSectionHeader(t("services.serviceshired") + ':')}
                                {renderLoadSection()}
                                
                                {myBookings.length > 0 && !isLoadBookServices && (
                                    <Box gap="md">
                                    {myBookings.map(service => {
                                        const serviceOptions = getCategoryOptions(service.categories || []);

                                        return (
                                            <Box key={service.id}>
                                                <ServicePost
                                                    bookService={service}
                                                    serviceOptions={serviceOptions}
                                                    onRate={handleRateServicePress}
                                                    onDetail={() => navigateToChat(service)}
                                                />
                                            </Box>
                                        );
                                        
                                    })}
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