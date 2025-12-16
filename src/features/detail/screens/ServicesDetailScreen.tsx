import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  ImageSourcePropType,
  ScrollView,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
  PanResponder,
  View,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  Pressable,
  Modal
} from 'react-native';
import images from '@/assets/images/images';
import Toast from 'react-native-toast-message';
import { Box } from '@/design-system/components/layout/Box';
import { Typography } from '@/design-system/components/foundation/Typography';
import { Row } from '@/design-system/components/layout/Row/Row';
import { Button, theme, SafeContainer, GroupChipSelector } from '@/design-system';
import { Icon } from '@/design-system/components/layout/Icon';
import { RatingReview } from '../components/RatingReview';
import { useCreateBookServiceMutation } from '@/features/services/store/services.api';
import { useCreateFavoriteMutation, useDeleteFavoriteMutation } from '@/features/favorites/store/favorites.api';
import { BookServiceForm } from '../components/BookServiceForm';
import { CreateBookServiceRequest, Service } from '@/features/services/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProfileStyles } from '@/features/profile/screens/profile/profile.styles';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ImageViewer } from '@/design-system/components/ImageViewer/ImageViewer';
import { Rating, useGetRatingsByServiceQuery } from '@/features/ratings/store';

const { width } = Dimensions.get('window');

type VideoPlayerWrapperProps = {
  uri: string;
  style?: any;
};

export const ServicesDetailScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselScrollViewRef = useRef<ScrollView>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const openPreview = (uri: string) => setPreviewImage(uri);
  const closePreview = () => setPreviewImage(null);
  const [sectionPositions, setSectionPositions] = useState({
    portfolio: 0,
    bookingdetail: 0,
    userreviews: 0
  });
  const post: Service = JSON.parse(params.post as string);
  const [createBookService, { isLoading: isLoadBookingService}] = useCreateBookServiceMutation();
  const [createFavorite, {isLoading: isLoadingCreaFav}] = useCreateFavoriteMutation();
  const [deleteFavorite, {isLoading: isLoadingDelFav}] = useDeleteFavoriteMutation();
  const { data: ratingsData } = useGetRatingsByServiceQuery({ serviceId: post.id });

  const [isFavorite, setIsFavorite] = useState(post.isFavorite ?? false);
  const [isScrollingProgrammatically, setIsScrollingProgrammatically] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(['portfolio']);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dotPressInProgress, setDotPressInProgress] = useState(false);
  const [serviceBookVisible, setServiceBookVisible] = useState(false);
  const itemsDetail = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'bookingdetail', label: 'Service Detail' },
    { id: 'userreviews', label: 'User Reviews' },
  ];
  const imageGallery = post.media;
  const slideWidth = width - theme.spacing.md * 2;
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  const handleGoBackPress = () => router.back();
  const handleFavoritePress = async () => {
    const prevValue = isFavorite;
    setIsFavorite(!prevValue);
    try {
      if (prevValue) {
        await deleteFavorite(post.id).unwrap();
        if (!isLoadingDelFav) {
          Toast.show({
            type: "success",
            text1: "Favorito",
            text2: "Servicio eliminado de favorito",
          });
        }
      } else {
        await createFavorite({ service_id: post.id }).unwrap();
        if (!isLoadingCreaFav) {
          Toast.show({
            type: "success",
            text1: "Favorito",
            text2: "Servicio agregado a favorito",
          });
        }
      }
    } catch (error: any) {
      setIsFavorite(prevValue);
      Toast.show({
        type: "error",
        text1: "Error Favorito",
        text2: error?.data?.message ?? "No se pudo actualizar el favorito.",
      });
    }
  };

  const handlePortfolioLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions(prev => ({ ...prev, portfolio: y }));
  };

  const handleBookingDetailLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions(prev => ({ ...prev, bookingdetail: y }));
  };

  const handleUserReviewsLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions(prev => ({ ...prev, userreviews: y }));
  };

  const determineVisibleSection = (scrollY: number) => {
    const scrollPosition = scrollY + 120;
    const bookingDetailStart = sectionPositions.bookingdetail;
    const userReviewsStart = sectionPositions.userreviews;
    if (scrollPosition < bookingDetailStart) {
      return 'portfolio';
    } else if (scrollPosition < userReviewsStart) {
      return 'bookingdetail';
    } else {
      return 'userreviews';
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isScrollingProgrammatically) return;
    const scrollY = event.nativeEvent.contentOffset.y;
    const visibleSection = determineVisibleSection(scrollY);
    if (selectedItemDetail[0] !== visibleSection) {
      setSelectedItemDetail([visibleSection]);
    }
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    if (selectedIds.length === 0 || (selectedIds.length === 1 && selectedIds[0] === selectedItemDetail[0])) return;
    setSelectedItemDetail(selectedIds);
    const selectedId = selectedIds[0];
    setIsScrollingProgrammatically(true);
    const position = selectedId === 'portfolio' ? 0 : sectionPositions[selectedId as keyof typeof sectionPositions];
    scrollViewRef.current?.scrollTo({
      y: Math.max(0, position - 5),
      animated: true,
    });
    setTimeout(() => {
      setIsScrollingProgrammatically(false);
    }, 1000);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        const isHorizontalGesture =
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        return isHorizontalGesture;
      },
      onPanResponderGrant: () => {
        Animated.timing(animatedOpacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
        if (gestureState.dx < -50 && currentImageIndex < imageGallery.length - 1) {
          handleDotPress(currentImageIndex + 1);
        } else if (gestureState.dx > 50 && currentImageIndex > 0) {
          handleDotPress(currentImageIndex - 1);
        }
      },
    })
  ).current;

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (dotPressInProgress) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setCurrentImageIndex(index);
  };

  const handleDotPress = (index: number) => {
    setDotPressInProgress(true);
    setCurrentImageIndex(index);
    carouselScrollViewRef.current?.scrollTo({
      x: slideWidth * index,
      y: 0,
      animated: false,
    });
    setTimeout(() => {
      setDotPressInProgress(false);
    }, 200);
  };

  const ratings: Rating[] = ratingsData?.ratings ?? [];
  const renderReviews = () => {
    return ratings.map((rating, index) => (
      <Box key={rating.username + '-' + index} marginBottom={index < ratings.length - 1 ? "md" : "none"}>
        <RatingReview
          rating={rating.rating}
          reviewDate={rating.reviewDate}
          username={rating.username}
          reviewText={rating.reviewText}
          reviewImages={rating.reviewImages}
          reviewTitle={rating.reviewTitle}
        />
      </Box>
    ));
  };

  const handleBookingSubmit = async (formData: any) => {
    try {
      const bookingData: CreateBookServiceRequest = {
        serviceId: post.id,
        serviceName: post.title,
        dateTime: formData.dateTime,
        address: formData.address,
        comments: formData.comments || undefined,
        responsibleName: formData.responsibleName,
        phoneNumber: formData.phoneNumber,
      };
      await createBookService(bookingData).unwrap();
      Toast.show({
        type: "success",
        text1: "Reserva Exitosa",
        text2: "Tu solicitud de servicio ha sido enviada correctamente",
      });
      return true;
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error en Reserva",
        text2: error?.data?.message ?? "No se pudo procesar la reserva. Intenta nuevamente.",
      });
      return false;
    }
  };

  const VideoPlayerWrapper = ({ uri, style }: VideoPlayerWrapperProps) => {
    const player = useVideoPlayer(uri, (player) => {
      player.loop = false;
      player.muted = false;
      player.allowsExternalPlayback = false;
      player.play();
    });

    return (
      <VideoView
        style={style}
        player={player}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture={false}
      />
    );
  };

  return (
    <SafeContainer fluid backgroundColor="colorBaseBlack" paddingHorizontal="md">
      <Modal visible={!!previewImage} transparent animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={closePreview}
        >
          {previewImage && (
            <ImageViewer
              sourceType="url"
              source={previewImage}
              width={350}
              height={350}
            />
          )}
        </Pressable>
      </Modal>
      <Box>
        <Box style={styles.backgroundImageContainer}>
          <Image
            source={images.gradientBlueAndPurpleTop as ImageSourcePropType}
            resizeMode="contain"
            style={styles.backgroundImage}
          />
        </Box>
        <Row alignItems="center" justifyContent="space-between" marginTop="xl" height={60}>
          <Box width={60} height={60} justifyContent="center" alignItems="center">
            <Button
              label=""
              centerIcon="chevron-left"
              onPress={handleGoBackPress}
              variant="centerIconOnly"
            />
          </Box>
          <Box justifyContent="center" alignItems="center" maxWidth={220}>
            <Typography variant="bodyLarge" color={theme.colors.colorBaseWhite} truncate>
              {post.title}
            </Typography>
            <Row spacing="sm">
              <Typography variant="bodyRegular" color={theme.colors.colorGrey100}>
                ${post.price}/hr
              </Typography>
              <Typography variant="bodySmall" color={theme.colors.colorGrey300}> | </Typography>
              <Typography variant="bodyRegular" color={theme.colors.colorGrey100}>
                1.5 Km
              </Typography>
            </Row>
          </Box>
          <Box width={60} height={60} justifyContent="center" alignItems="center">
            <Button
              label=""
              centerIcon={
                isFavorite
                  ? (images.bookmarkSiBg as ImageSourcePropType)
                  : (images.bookmarkNoBg as ImageSourcePropType)
              }
              onPress={handleFavoritePress}
              variant="centerIconOnly"
              iconWidth={20}
              iconHeight={20}
            />
          </Box>
        </Row>
        <Box marginTop="sm">
          <GroupChipSelector
            onChange={handleSelectionChange}
            options={itemsDetail}
            selectedIds={selectedItemDetail}
            variant="horizontal"
            multiSelect={false}
            textVariant="bodyMedium"
          />
        </Box>
      </Box>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        indicatorStyle="white"
        contentContainerStyle={styles.scrollViewMainContent}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        style={styles.scrollView}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View>
            <View onLayout={handlePortfolioLayout}>
              <Box marginTop="sm" zIndex={1}>
                <Box>
                  <Box style={styles.carouselContainer} pointerEvents="box-none">
                    <Animated.View
                      style={[styles.carouselWrapper, { opacity: animatedOpacity }]}
                      {...panResponder.panHandlers}
                    >
                      <ScrollView
                        ref={carouselScrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleScrollEnd}
                        scrollEventThrottle={16}
                        decelerationRate="fast"
                        snapToInterval={slideWidth}
                        snapToAlignment="center"
                        contentContainerStyle={styles.scrollViewContent}
                        pagingEnabled
                      >
                        {imageGallery.map((media, index) => (
                          <Pressable
                            key={index}
                            onPress={() => {
                              if (media.kind === 'video') return;
                              openPreview(media.variants.public?.url ?? '');
                            }}
                          >
                            <Box width={slideWidth} height={230}>
                              {media.kind === 'video' && media.variants.public?.url ? (
                                <VideoPlayerWrapper
                                  uri={media.variants.public.url}
                                  style={styles.carouselImage}
                                />
                              ) : (
                                <Image
                                  source={{ uri: media.variants.public?.url ?? '' }}
                                  style={styles.carouselImage}
                                  resizeMode="cover"
                                />
                              )}
                            </Box>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </Animated.View>
                  </Box>
                  <Row position="absolute" left={0} right={0} bottom={15} justifyContent="center" pointerEvents="box-none">
                    {imageGallery.map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleDotPress(index)}
                        hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
                      >
                        <Box
                          style={[
                            styles.indicator,
                            currentImageIndex === index ? styles.activeIndicator : {},
                          ]}
                        />
                      </TouchableOpacity>
                    ))}
                  </Row>
                </Box>
                <Row justifyContent="space-between" borderBottomWidth={0.5}
                  borderBottomColor="colorGrey400"
                  paddingBottom="md"
                  marginTop="md"
                  marginBottom="md"
                >
                  <Row spacing="xs" alignItems="flex-start">
                    <Icon size={20} name="tag" color="colorBaseWhite"></Icon>
                    <Box marginLeft="xs">
                      <Typography variant="bodySmall" color={theme.colors.colorGrey200}>Price</Typography>
                      <Typography variant="bodyLarge" color={theme.colors.colorBaseWhite}>
                        ${post.price}/hr
                      </Typography>
                    </Box>
                  </Row>
                  <Row spacing="xs" alignItems="flex-start">
                    <Icon size={20} name="location" color="colorBaseWhite"></Icon>
                    <Box marginLeft="xs">
                      <Typography variant="bodySmall" color={theme.colors.colorGrey200}>Location</Typography>
                      <Typography variant="bodyLarge" color={theme.colors.colorBaseWhite}>
                        {post.city}
                      </Typography>
                    </Box>
                  </Row>
                  <Box style={styles.labelDetail} justifyContent='center' alignItems='center'>
                    <Image style={styles.imageLabelDetail} source={images.labelGrayImage as ImageSourcePropType} />
                    { images.labelGrayImage ? <Typography variant="bodySmall" color="white">Super Host</Typography> : null }
                  </Box>
                </Row>
              </Box>
            </View>
            <View onLayout={handleBookingDetailLayout}>
              <Box>
                <Row spacing="sm">
                  <Image source={{ uri: post.provider.media?.profileThumbnail?.url }}
                    resizeMode="contain"
                    style={getProfileStyles.profileImageAll}
                  />
                  <Box marginLeft="sm">
                    <Typography variant="bodySmall" color={theme.colors.colorGrey200}>{post.title}</Typography>
                    <Typography variant="bodyLarge" color="white">{post.provider.name}</Typography>
                  </Box>
                </Row>
                <Box marginTop="md">
                  <Typography variant="bodyRegular" color={theme.colors.colorGrey100}>
                    {post.description}
                  </Typography>
                </Box>
              </Box>
            </View>
            <View onLayout={handleUserReviewsLayout}>
              <Box marginTop="lg">
                {renderReviews()}
              </Box>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Box
        position="absolute"
        bottom={0}
        width="100%"
        alignSelf="center"
        marginBottom="sm"
      >
        <Button
          variant="secondary"
          label={"Book Service"}
          onPress={() => setServiceBookVisible(true)}
        />
      </Box>
      <BookServiceForm
        visible={serviceBookVisible}
        disabled={isLoadBookingService}
        onClose={() => setServiceBookVisible(false)}
        service={post}
        onSubmit={handleBookingSubmit}
      />
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  backgroundImageContainer: {
    position: 'absolute',
    top: -60,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
  },
  scrollViewMainContent: {
    position: "relative",
    flexGrow: 1,
    paddingBottom: 80
  },
  scrollView: {
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
  carouselContainer: {
    position: 'relative',
    height: 230,
    borderRadius: 12,
    overflow: 'hidden',
  },
  carouselWrapper: {
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingRight: 0,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  indicator: {
    width: 15,
    height: 5,
    backgroundColor: theme.colors.colorGrey200,
    borderRadius: 5,
    zIndex: 1,
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: theme.colors.colorBaseWhite,
  },
  labelDetail: {
    width: 102,
    height: 27.66
  },
  imageLabelDetail: {
    position: 'absolute'
  },
});