import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '@shopify/restyle';

// Design System
import { Box, Typography, Theme } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';

// Assets
import images from '@/assets/images/images';
import { getPremiumCardStyles } from './PremiumCard.styles';
import { PremiumCardProps } from './types';

export const PremiumCard: React.FC<PremiumCardProps> = ({ title, features }) => {
  const theme = useTheme<Theme>();

  return (
    <Box
      style={getPremiumCardStyles.provCard}
      borderRadius={12}
      justifyContent="flex-end"
      marginTop="xl"
      marginBottom="xl"
    >
      <Box style={getPremiumCardStyles.images}>
        <Image
          source={images.bgProvMode as ImageSourcePropType}
          resizeMode="cover"
        />
        <Image
          style={getPremiumCardStyles.linearGradientBlack}
          source={images.linearGradientBlackProM as ImageSourcePropType}
          resizeMode="cover"
        />
      </Box>

      <Box>
        <Box maxWidth={250} marginBottom="md">
          <Typography variant="headingPrimary" color="white">
            {title}
          </Typography>
        </Box>
        
        <Box maxWidth={300} gap="sm">
          {features.map((feature, index) => (
            <Row key={index} spacing="sm" alignItems="flex-start">
              <Image
                source={images.vignette as ImageSourcePropType}
                resizeMode="cover"
              />
              <Typography variant="bodyRegular" color={theme.colors.colorGrey100}>
                {feature}
              </Typography>
            </Row>
          ))}
        </Box>
      </Box>
    </Box>
  );
};