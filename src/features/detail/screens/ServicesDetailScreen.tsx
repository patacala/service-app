import React, { useState, useRef } from 'react';
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
} from 'react-native';
import images from '@/assets/images/images';
import Toast from 'react-native-toast-message';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Box } from '@/design-system/components/layout/Box';
import { Typography } from '@/design-system/components/foundation/Typography';
import { Row } from '@/design-system/components/layout/Row/Row';
import { Button, theme, SafeContainer, GroupChipSelector } from '@/design-system';
import { CardPost } from '@/features/wall/slices/wall.slice';
import { Icon } from '@/design-system/components/layout/Icon';
import { RatingReview } from '../components/RatingReview';
import { useCreateFavoriteMutation, useDeleteFavoriteMutation } from '@/features/favorites/store/favorites.api';
import { BookServiceForm } from '../components/BookServiceForm';

const { width } = Dimensions.get('window');

export const ServicesDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselScrollViewRef = useRef<ScrollView>(null);
  const [sectionPositions, setSectionPositions] = useState({
    portfolio: 0,
    bookingdetail: 0,
    userreviews: 0
  });
  const { post } = route.params as { post: CardPost };
  const [createFavorite, {isLoading: isLoadingCreaFav}] = useCreateFavoriteMutation();
  const [deleteFavorite, {isLoading: isLoadingDelFav}] = useDeleteFavoriteMutation();
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

  const reviews = [
    {
      rating: 4.2,
      reviewDate: '21 Apr',
      username: 'Username_010',
      reviewText: 'I hired them a month ago for a complete interior painting of my home, and the results are absolutely stunning.',
      reviewImages: [
        images.reviewImage1 as ImageSourcePropType,
        images.reviewImage2 as ImageSourcePropType,
        images.reviewImage3 as ImageSourcePropType
      ],
      reviewTitle: 'Awesome Work!',
    },
    {
      rating: 4.2,
      reviewDate: '15 Apr',
      username: 'Customer_456',
      reviewText: 'Professional service with attention to detail. They completed the job ahead of schedule and the quality exceeded my expectations.',
      reviewImages: [
        images.reviewImage2 as ImageSourcePropType,
        images.reviewImage3 as ImageSourcePropType
      ],
      reviewTitle: 'Great Experience',
    },
    {
      rating: 4.2,
      reviewDate: '02 Apr',
      username: 'HomeOwner_22',
      reviewText: 'The team was courteous and skilled. They transformed my living space with beautiful paint work and clean edges.',
      reviewImages: [
        images.reviewImage1 as ImageSourcePropType,
      ],
      reviewTitle: 'Highly Recommended',
    },
  ];

  const imageGallery: ImageSourcePropType[] = [
    images.cardImage1 as ImageSourcePropType, 
    images.cardImage2 as ImageSourcePropType, 
    images.cardImage3 as ImageSourcePropType, 
    images.cardImage2 as ImageSourcePropType, 
    post.image,
  ];
  
  const slideWidth = width - theme.spacing.md * 2;
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  const handleGoBackPress = () => navigation.goBack();

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

  const renderReviews = () => {
    return reviews.map((review, index) => (
      <Box key={review.username + '-' + index} marginBottom={index < reviews.length - 1 ? "md" : "none"}>
        <RatingReview 
          rating={review.rating}
          reviewDate={review.reviewDate}
          username={review.username}
          reviewText={review.reviewText}
          reviewImages={review.reviewImages}
          reviewTitle={review.reviewTitle}
        />
      </Box>
    ));
  };

  return (
    <SafeContainer fluid backgroundColor="colorBaseBlack" paddingHorizontal="md">
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

          <Box justifyContent="center" alignItems="center"  maxWidth={220}>
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
            {/* SECCIÓN: PORTFOLIO */}
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
                        pagingEnabled={true}
                      >
                        {imageGallery.map((image, index) => (
                          <Box key={index} width={slideWidth} height={230}>
                            <Image source={image} style={styles.carouselImage} resizeMode="cover" />
                          </Box>
                        ))}
                      </ScrollView>
                    </Animated.View>

                    <TouchableOpacity
                      style={[styles.touchArea, styles.leftTouchArea]}
                      activeOpacity={1}
                      onPress={() => currentImageIndex > 0 && handleDotPress(currentImageIndex - 1)}
                    />
                    <TouchableOpacity
                      style={[styles.touchArea, styles.rightTouchArea]}
                      activeOpacity={1}
                      onPress={() =>
                        currentImageIndex < imageGallery.length - 1 &&
                        handleDotPress(currentImageIndex + 1)
                      }
                    />

                    <Image
                      style={styles.linearGradientBlack}
                      source={images.linearGradientBlack as ImageSourcePropType}
                      resizeMode="cover"
                    />
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

            {/* SECCIÓN: BOOKING DETAIL */}
            <View onLayout={handleBookingDetailLayout}>
              <Box>
                <Row spacing="sm">
                  <Image source={images.profile1 as ImageSourcePropType} />
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

            {/* SECCIÓN: USER REVIEWS */}
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

      {/* <BookServiceForm
        visible={serviceBookVisible}
        onClose={() => setServiceBookVisible(false)}
        chipOptions={[{ id: post.category.toLowerCase(), label: post.category, icon: 'painter' }]}
      /> */}
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
  linearGradientBlack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
  touchArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '30%',
    zIndex: 5,
  },
  leftTouchArea: {
    left: 0,
  },
  rightTouchArea: {
    right: 0,
  },
  labelDetail: {
    width: 102,
    height: 27.66
  },  
  imageLabelDetail: {
    position: 'absolute'
  },
});