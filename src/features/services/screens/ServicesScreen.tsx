import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Box, ChipOption, Typography, theme } from "@/design-system";
import { getServicesStyles } from './services/services.styles';
import { LocationPanel } from "@/features/wall/components/LocationPanel";
import { ServicePost } from "../components/ServicePost";
import { CancelService } from "../components/CancelService";
import { RateService } from "../../ratings/components/RateService";
import { useGetCategoriesQuery } from "@/infrastructure/services/api";
import { useGetMyBookServicesQuery, useUpdateBookServiceStatusMutation } from "../store/services.api";
import { useCreateRatingMutation } from "@/features/ratings/store/ratings.api";
import { BookService } from "../store";
import { getWallStyles } from "@/features/wall/screens/wall/wall.style";
import { getDeviceLanguage } from "@/assembler/config/i18n";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { CompletedService } from "../components/CompleteService";
import { RatingVisibility, RoleOfRater } from "@/features/ratings/store/ratings.types";

interface Location {
    id: string;
    name: string;
}

export const ServicesScreen = () => {
    const router = useRouter();
    const { t } = useTranslation('auth');
    const { user } = useAuth();
    const [locationPanelVisible, setLocationPanelVisible] = useState(false);
    const [cancelServiceVisible, setCancelServiceVisible] = useState(false);
    const [completedServiceVisible, setCompletedServiceVisible] = useState(false);
    const [rateServiceVisible, setRateServiceVisible] = useState(false);
    const [selectedServiceToCancel, setSelectedServiceToCancel] = useState<BookService | null>(null);
    const [selectedServiceToCompleted, setSelectedServiceToCompleted] = useState<BookService | null>(null);
    const [selectedServiceToRate, setSelectedServiceToRate] = useState<BookService | null>(null);
    const [createRating, { isLoading: isLoadingRating }] = useCreateRatingMutation();

    const [updateBookServiceStatus, {isLoading: isLoadBookServiceUpdate}] = useUpdateBookServiceStatusMutation();
    const { data: categoriesData, error: categoriesError } = useGetCategoriesQuery({ language: getDeviceLanguage() }, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const { data: bookServices, isLoading: isLoadBookServices, isFetching: isFetchingBookServices, error: bookServicesError } = useGetMyBookServicesQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        pollingInterval: 60000,
    });
    const [currentLocation, setCurrentLocation] = useState<Location>({ id: '1', name: 'Miami, FL' });

    const categories = useMemo<ChipOption[]>(() => {
        return (
            categoriesData?.categories?.map((c: any) => ({
            id: c.id,
            label: c.name,
            })) ?? []
        );
    }, [categoriesData?.categories]);

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
    }, [categoriesError, t]);

    useEffect(() => {
        if (bookServicesError) {
            Toast.show({
            type: 'error',
            text1: t("services.msgerrorrservices"),
            text2: t("services.msgcouldrservices"),
            });
        }
    }, [bookServicesError, t]);

    const otherBookings = useMemo<BookService[]>(() => {
        return isLoadBookServices || isFetchingBookServices
            ? []
            : bookServices?.otherBookings ?? [];
    }, [isLoadBookServices, isFetchingBookServices, bookServices?.otherBookings]);

    const myBookings = useMemo<BookService[]>(() => {
        return isLoadBookServices || isFetchingBookServices
            ? []
            : bookServices?.myBookings ?? [];
    }, [isLoadBookServices, isFetchingBookServices, bookServices?.myBookings]);

    const sortBookingsByRatedLast = (bookings: BookService[]) => {
        if (!bookings) return [];
        return [...bookings].sort((a, b) => {
            if (a.status === "rated" && b.status !== "rated") return 1;
            if (a.status !== "rated" && b.status === "rated") return -1;
            return 0;
        });
    };

    const sortedMyBookings = useMemo(() => sortBookingsByRatedLast(myBookings), [myBookings]);
    const sortedOtherBookings = useMemo(() => sortBookingsByRatedLast(otherBookings), [otherBookings]);

    const handleSelectLocation = (location: Location) => {
        setCurrentLocation(location);
    };

    const handleCancelServicePress = (service: BookService) => {
        setSelectedServiceToCancel(service);
        setCancelServiceVisible(true);
    }

    const handleConfirmCancel = async () => {
        if (!selectedServiceToCancel?.id) {
            Toast.show({
                type: 'error',
                text1: t("services.error"),
                text2: t("services.servicecanerror"),
            });
            return;
        }

        try {
            await updateBookServiceStatus({
                id: selectedServiceToCancel.id,
                status: 'cancelled'
            }).unwrap();

            Toast.show({
                type: 'success',
                text1: t("messages.msg22"),
                text2: t("services.servicecancelled"),
            });

            setCancelServiceVisible(false);
            setSelectedServiceToCancel(null);
        } catch (error) {
            console.error('Error cancelling service:', error);
            Toast.show({
                type: 'error',
                text1: t("services.error"),
                text2: t("services.failedtocancel"),
            });
        }
    };

    const handleCompletedServicePress = (service: BookService) => {
        setSelectedServiceToCompleted(service);
        setCompletedServiceVisible(true);
    }

    const handleConfirmCompleted = async () => {
        if (!selectedServiceToCompleted?.id) {
            Toast.show({
                type: 'error',
                text1: t("services.error"),
                text2: t("services.servicecanerror"),
            });
            return;
        }

        try {
            await updateBookServiceStatus({
                id: selectedServiceToCompleted.id,
                status: 'completed'
            }).unwrap();

            Toast.show({
                type: 'success',
                text1: t("messages.msg22"),
                text2: t("services.servicecompleted"),
            });

            setSelectedServiceToCompleted(null);
            setCompletedServiceVisible(false);
        } catch (error) {
            console.error('Error completing service:', error);
            Toast.show({
                type: 'error',
                text1: t("services.error"),
                text2: t("services.servicecompleted"),
            });
        }
    };

    const handleSubmitRating = async (rating: number, title: string, comment: string) => {
        if (!selectedServiceToRate) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No hay un servicio seleccionado para calificar.",
            });
            return;
        }

        const isClientRating = selectedServiceToRate.client.id === user?.id;
        const payload = {
            ratedUserId: isClientRating ? selectedServiceToRate.provider.id : selectedServiceToRate.client.id,
            serviceId: selectedServiceToRate.serviceId,
            bookingId: selectedServiceToRate.id,
            roleOfRater: isClientRating ? RoleOfRater.CLIENT : RoleOfRater.PROVIDER,
            score: rating,
            title: title,
            body: comment,
            visibility: RatingVisibility.PUBLIC,
        };

        try {
            await createRating(payload).unwrap();

            Toast.show({
                type: "success",
                text1: "Rating enviado",
                text2: "Gracias por tu calificación.",
            });

            setRateServiceVisible(false);
            setSelectedServiceToRate(null);
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error al enviar rating",
                text2: error?.data?.message ?? "Intenta nuevamente.",
            });
            throw error;
        }
    };

    const handleRateServicePress = (service: BookService) => {
        setSelectedServiceToRate(service);
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
            <Box height="84%">
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
                                        {sortedOtherBookings.map(service => {
                                        const serviceOptions = getCategoryOptions(service.categories || []);

                                        return (
                                            <Box key={service.id}>
                                            <ServicePost
                                                bookService={service}
                                                serviceOptions={serviceOptions}
                                                onRate={() => handleRateServicePress(service)}
                                                onCancel={() => handleCancelServicePress(service)}
                                                onDetail={() => navigateToChat(service)}
                                                onCompleted={() =>  handleCompletedServicePress(service)}
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
                                
                                {sortedMyBookings.length > 0 && !isLoadBookServices && (
                                    <Box gap="md">
                                    {sortedMyBookings.map(service => {
                                        const serviceOptions = getCategoryOptions(service.categories || []);

                                        return (
                                            <Box key={service.id}>
                                                <ServicePost
                                                    bookService={service}
                                                    serviceOptions={serviceOptions}
                                                    onRate={() => handleRateServicePress(service)}
                                                    onCancel={() => handleCancelServicePress(service)}
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
                onClose={() => {
                    setCancelServiceVisible(false);
                    setSelectedServiceToCancel(null);
                }}
                onCancel={handleConfirmCancel}
                isLoading={isLoadBookServiceUpdate}
            />

            <CompletedService
                visible={completedServiceVisible}
                onClose={() => {
                    setCompletedServiceVisible(false);
                    setSelectedServiceToCompleted(null);
                }}
                onComplete={handleConfirmCompleted}
                isLoading={isLoadBookServiceUpdate}
            />

            <RateService
                visible={rateServiceVisible}
                onClose={() => {
                    setRateServiceVisible(false);
                    setSelectedServiceToRate(null);
                }}
                onRate={handleSubmitRating}
                isLoading={isLoadingRating}
            />
        </>
        );
};