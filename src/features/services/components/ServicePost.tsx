import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { Box, Button, ChipOption, GroupChipSelector, theme, Typography } from "@/design-system";
import { Row } from "@/design-system/components/layout/Row/Row";
import images from "@/assets/images/images";
import { Icon } from "@/design-system/components/layout/Icon";
import { BookService } from "../store";
import { useTranslation } from "react-i18next";

interface ServicePostProps {
  bookService: BookService;
  serviceOptions: ChipOption[];
  onCancel?: (serviceId: string) => void;
  onRate?: (serviceId: string) => void;
  onDetail?: (serviceId: string) => void;
}

export const ServicePost: React.FC<ServicePostProps> = ({
  bookService,
  serviceOptions,
  onCancel = () => console.log("Service cancelled"),
  onRate = () => console.log("Service rated"),
  onDetail = () => console.log("Service detail")
}) => {
  const { t } = useTranslation('auth');
  
  const handleCancel = () => {
    onCancel(bookService.id);
  };

  const handleRate = () => {
    onRate(bookService.id);
  };

  const handleDetail = () => {
    onDetail(bookService.id);
  };

  /* const chipOptionsArray = [bookService.chipOption]; */

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
            source={bookService.image || images.profile1 as ImageSourcePropType}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20
            }}
          />
          <Box marginLeft="sm" width="100%" maxWidth={170}>
            <Typography variant="bodyMedium" color={theme.colors.colorGrey200} truncate>
              {bookService.serviceName}
            </Typography>
            <Typography variant="bodyLarge" color="white" truncate>
              {bookService.bookingType === 'provider' ? bookService.client.name:bookService.provider.name}
            </Typography>
          </Box>
        </Row>
        <Box alignItems="flex-end" gap="sm">
          <Typography variant="bodySmall" color={theme.colors.colorGrey100}>
            {bookService.dateShort}
          </Typography>
          <Typography variant="bodySmall" color={theme.colors.colorGrey100}>
            {bookService.timeShort}
          </Typography>
        </Box>
      </Row>

      <Box marginBottom="xs">
        <Row spacing="sm">
          <Icon name="location" size={25} color="colorGrey100" />
          <Typography variant="bodySmall" color={theme.colors.colorGrey100}>
            {bookService.address}
          </Typography>
        </Row>
      </Box>

      <Row spacing="none" justifyContent="flex-start">
        <GroupChipSelector
          onChange={() => {}}
          options={serviceOptions}
          selectedIds={bookService.categories || []}
          variant="horizontal"
          multiSelect={false}
          textVariant="bodyMedium"
        />
        
        <Box position="relative" right={-10} maxWidth={180}>
          {bookService.status === 'completed' && (
            <Button
              variant="transparent"
              label={bookService.bookingType === 'client' ? t("services.btnrateservice"):t("services.btnrateuser")}
              iconWidth={20}
              iconHeight={19}
              leftIcon={images.starOutline as ImageSourcePropType}
              onPress={handleRate}
            />
          )}

          {bookService.status === 'pending' && bookService.bookingType === 'client' && (
            <Button
              variant="transparent"
              label={t("services.cancel")}
              iconWidth={18}
              iconHeight={18}
              leftIcon={images.clearIcon as ImageSourcePropType}
              onPress={handleCancel}
            />
          )}

          {bookService.status === 'pending' && bookService.bookingType === 'provider' && (
            <Button
              variant="transparent"
              label={t("services.detailservice")}
              iconWidth={18}
              iconHeight={18}
              rightIcon={images.rightArrow as ImageSourcePropType}
              onPress={handleDetail}
            />
          )}

          {bookService.status === 'rejected' && (
            <Button
              variant="transparent"
              label={t("services.rejectedservice")}
              iconWidth={18}
              iconHeight={18}
              textColor="colorFeedbackError"
              rightIcon={images.rightArrow as ImageSourcePropType}
              onPress={handleDetail}
            />
          )}

          {bookService.status === 'accepted' && (
            <Button
              variant="transparent"
              label={t("services.acceptedservice")}
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