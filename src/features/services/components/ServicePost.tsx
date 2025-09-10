import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { Box, Button, theme, Typography } from "@/design-system";
import { Row } from "@/design-system/components/layout/Row/Row";
import images from "@/assets/images/images";
import { Icon } from "@/design-system/components/layout/Icon";
import { BookService } from "../store";

interface ServicePostProps {
  servicePost: BookService;
  onCancel?: (serviceId: string) => void;
  onRate?: (serviceId: string) => void;
  onDetail?: (serviceId: string) => void;
}

export const ServicePost: React.FC<ServicePostProps> = ({
  servicePost,
  onCancel = () => console.log("Service cancelled"),
  onRate = () => console.log("Service rated"),
  onDetail = () => console.log("Service detail")
}) => {
  const handleCancel = () => {
    onCancel(servicePost.id);
  };

  const handleRate = () => {
    onRate(servicePost.id);
  };

  const handleDetail = () => {
    onDetail(servicePost.id);
  };

  /* const chipOptionsArray = [servicePost.chipOption]; */

  return (
    <Box
      backgroundColor="colorGrey600"
      padding="md"
      borderRadius={16}
      gap="sm"
    >
      <Row justifyContent="space-between">
        <Row spacing="none">
          <Image
            source={servicePost.image || images.profile1 as ImageSourcePropType}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20
            }}
          />
          <Box marginLeft="sm" width="100%" maxWidth={179}>
            <Typography variant="bodyMedium" color={theme.colors.colorGrey200} truncate>
              {servicePost.role === 'provider' ? 'User' : servicePost.serviceName}
            </Typography>
            <Typography variant="bodyLarge" color="white" truncate>
              {servicePost.provider.name}
            </Typography>
          </Box>
        </Row>
        <Box alignItems="flex-end">
          <Typography variant="bodySmall" color={theme.colors.colorGrey100}>
            {servicePost.dateShort}
          </Typography>
          <Typography variant="bodySmall" color={theme.colors.colorGrey100}>
            {servicePost.timeShort}
          </Typography>
        </Box>
      </Row>

      <Box marginBottom="xs">
        <Row spacing="sm">
          <Icon name="location" size={25} color="colorGrey100" />
          <Typography variant="bodySmall" color={theme.colors.colorGrey100}>
            {servicePost.address}
          </Typography>
        </Row>
      </Box>

      <Row spacing="none" justifyContent="flex-end">
        {/* <GroupChipSelector
          onChange={() => ({})}
          options={chipOptionsArray}
          selectedIds={servicePost.selectedChipId ? [servicePost.selectedChipId] : []}
          multiSelect={false}
          noPadding={true}
        /> */}
        
        {servicePost.status === 'pending' && servicePost.role === 'user' && (
          <Button
            variant="transparent"
            label="Cancel"
            iconWidth={18}
            iconHeight={18}
            leftIcon={images.clearIcon as ImageSourcePropType}
            onPress={handleCancel}
          />
        )}
        
        <Box maxWidth={180} justifyContent="flex-end">
          {servicePost.status === 'completed' && (
            <Button
              variant="transparent"
              label={servicePost.role === 'user' ? "Rate Service":"Rate User"}
              iconWidth={20}
              iconHeight={19}
              leftIcon={images.starOutline as ImageSourcePropType}
              onPress={handleRate}
            />
          )}

          {servicePost.status === 'pending' && servicePost.role === 'provider' && (
            <Button
              variant="transparent"
              label="Service Details"
              iconWidth={18}
              iconHeight={18}
              rightIcon={images.rightArrow as ImageSourcePropType}
              onPress={handleDetail}
            />
          )}
        </Box>
      </Row>
    </Box>
  );
};