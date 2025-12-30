import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box, Typography, GroupChipSelector, Button, Theme , ChipOption } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import { Icon } from '@/design-system/components/layout/Icon';

import images from '@/assets/images/images';
import { MyService } from '../store';

interface ServiceOfferProps {
  service: MyService;
  serviceOptions: ChipOption[];
  onEditPress: (serviceId: string) => void;
}

export const ServiceOffer: React.FC<ServiceOfferProps> = ({
  service,
  serviceOptions,
  onEditPress,
}) => {
  const theme = useTheme<Theme>();

  return (
    <Box
      marginTop="lg"
      paddingHorizontal="md"
      paddingTop="sm"
      paddingBottom="md"
      backgroundColor="colorGrey600"
      borderRadius={16}
      gap="sm"
    >
      <Row justifyContent="space-between">
        <Row spacing="none" gap="lg">
          <Box maxWidth={130}>
            <GroupChipSelector
              onChange={() => {}}
              options={serviceOptions}
              selectedIds={service.categories || []}
              variant="horizontal"
              multiSelect={false}
              textVariant="bodyMedium"
            />
          </Box>
          <Typography variant="bodyMedium" color={theme.colors.colorBaseWhite}>
            ${service.price}/Hr
          </Typography>
        </Row>
        <Box>
          <Button
            variant="transparent"
            label="Edit"
            iconWidth={20}
            iconHeight={20}
            leftIcon={images.iconEdit as ImageSourcePropType}
            onPress={() => onEditPress(service.id)}
          />
        </Box>
      </Row>

      <Box gap="sm">
        <Row spacing="sm">
          <Icon name="location" color="colorBaseWhite" />
          <Typography variant="bodySmall" color={theme.colors.colorBaseWhite}>
            {service.city}
          </Typography>
        </Row>

        <Typography variant="bodyRegular" color={theme.colors.colorGrey100}>
          {service.description}
        </Typography>
      </Box>
    </Box>
  );
};