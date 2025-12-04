import React from 'react';
import { StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Box } from '@/design-system/components/layout/Box';
import { Typography } from '@/design-system/components/foundation/Typography';
import { Row } from '@/design-system/components/layout/Row/Row';
import { theme } from '@/design-system';
import { Icon } from '@/design-system/components/layout/Icon';
import images from '@/assets/images/images';

// Tipo de props para el componente
interface RatingReviewProps {
  rating: string;
  reviewDate: string;
  username: string;
  reviewText: string;
  reviewImages?: ImageSourcePropType[];
  reviewTitle?: string;
}

export const RatingReview = ({ 
  rating,
  reviewDate,
  username,
  reviewText,
  reviewImages,
  reviewTitle
}: RatingReviewProps) => {
  
  // Función para renderizar estrellas basadas en la puntuación
  const renderStars = (count: number, size: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <Icon 
          key={`star-${i}`} 
          name="star" 
          size={size} 
          color="colorGrey100" 
        />
      );
    }
    return stars;
  };
  
  return (
    <Box 
      width="100%" 
      backgroundColor="colorGrey600" 
      borderRadius={16} 
      paddingVertical="md" 
      paddingHorizontal="sm"
    >
      <Row justifyContent="space-between">
        <Row spacing="sm">
          <Icon name="star" size={25} color="colorGrey100" />
          <Typography variant="bodyMedium" color={theme.colors.colorGrey200}>
            Rating & Reviews
          </Typography>
        </Row>
        <Typography variant="headingPrimary" color="white">
          {rating}
        </Typography>
      </Row>
      
      <Box marginTop="md">
        <Row justifyContent="space-between">
          <Typography variant="bodyRegular" color={theme.colors.colorGrey100}>
            {reviewTitle}
          </Typography>
          <Typography variant="bodySmall" color={theme.colors.colorGrey200}>
            {reviewDate}
          </Typography>
        </Row>
        
        <Row justifyContent="space-between">
          <Row spacing="sm" justifyContent="center">
            {renderStars(5, 13)}
          </Row>
          <Typography variant="bodySmall" color={theme.colors.colorGrey200}>
            {username}
          </Typography>
        </Row>
        
        <Box marginTop="md">
          <Typography variant="bodyRegular" color={theme.colors.colorGrey100}>
            {reviewText}
          </Typography>
          
          <Row spacing="sm" justifyContent="flex-start" marginTop="sm">
            {reviewImages?.map((image, index) => (
              <Box key={`review-image-${index}`} width={60} height={60}>
                <Image 
                  style={styles.imageReview} 
                  source={image} 
                  resizeMode="cover"
                />
                <Image
                  style={styles.linearGradientBlackReview}
                  source={images.linearGradientBlack as ImageSourcePropType}
                  resizeMode="cover"
                />
              </Box>
            ))}
          </Row>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  imageReview: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  linearGradientBlackReview: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    top: 0,
    left: 0,
    opacity: 0.5
  },
});