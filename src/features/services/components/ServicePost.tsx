import React from "react";
import { Image, ImageSourcePropType, TouchableOpacity } from "react-native";
import { Box, Button, Chip, ChipOption, GroupChipSelector, theme, Typography } from "@/design-system";
import { Row } from "@/design-system/components/layout/Row/Row";
import images from "@/assets/images/images";
import { Icon } from "@/design-system/components/layout/Icon";
import { BookService } from "../store/services.types";
import { useTranslation } from "react-i18next";

interface ServicePostProps {
  bookService: BookService;
  serviceOptions: ChipOption[];
  onCancel?: () => void;
  onRate?: () => void;
  onDetail?: (bookService: BookService) => void;
  onCompleted?: () => void;
}

export const ServicePost: React.FC<ServicePostProps> = ({
  bookService,
  serviceOptions,
  onCancel = () => console.log("Service cancelled"),
  onRate = () => console.log("Service rated"),
  onDetail = () => console.log("Service detail"),
  onCompleted = () => console.log("Service complete")
}) => {
  const { t } = useTranslation('auth');
  
  const handleCancel = () => {
    onCancel();
  };

  const handleRate = () => {
    onRate();
  };

  const handleDetail = () => {
    onDetail(bookService);
  };

  const handleComplete = () => {
    onCompleted();
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
             source={{
                  uri:
                    (bookService.bookingType === 'client'
                      ? bookService.provider.media?.profileThumbnail?.url
                      : bookService.client.media?.profileThumbnail?.url) ||
                    'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d6201e99-87ce-450d-e6c1-91e3463f3600/profileThumbnail',
                }}
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
        <Box>
          {/* <Icon name="location" size={32} color="colorGrey100" /> */}
          {bookService.status !== 'pending' && (
              <TouchableOpacity onPress={handleDetail}>
                <Image
                  source={images.message as ImageSourcePropType}
                  style={{
                    width: 35,
                    height: 35,
                  }}
                />
              </TouchableOpacity>
          )}
        </Box>
      </Row>

      <Box marginVertical="xs">
        <Row spacing="sm">
          <Icon name="date" size={20} color="colorGrey100" />
          <Typography variant="bodySmall" color={theme.colors.colorGrey100}>
            {bookService.dateShort} - {bookService.timeShort}
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
        
        <Box position="relative" maxWidth={130}>
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

          {(bookService.status === 'cancelled' || bookService.status === 'rejected') && (
            <Box>
              <Typography
                variant="bodyLarge"
                color={bookService.status === 'cancelled' 
                  ? theme.colors.colorFeedbackError
                  : theme.colors.colorGrey200 }
              >
                {bookService.status === 'cancelled'
                  ? t("services.cancelledservice")
                  : t("services.rejectedservice")}
              </Typography>
            </Box>
          )}

          {bookService.status === 'accepted' && bookService.bookingType === 'provider' && (
            <Chip
              key="key-01"
              onPress={handleComplete}
              variant="md"
            >
              <Box backgroundColor="colorBaseBlack" 
                justifyContent="center"
                alignItems="center" 
                width={120} height={45}
                borderRadius={25}
              >
                <Typography 
                  color={theme.colors.colorGrey100} 
                  variant={"bodyRegular"}
                >
                  {t("services.completeservice")}
                </Typography>
              </Box>
            </Chip>
          )}

          {bookService.status === 'accepted' && bookService.bookingType === 'client' && (
            <Box>
              <Typography
                variant="bodyLarge"
                color={theme.colors.colorBaseWhite}
              >
                {t("services.acceptedservice")}
              </Typography>
            </Box>
          )}
        </Box>
      </Row>
    </Box>
  );
};