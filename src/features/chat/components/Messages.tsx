import React from 'react';
import { Image, ActivityIndicator } from "react-native";
import { Box, theme, Typography } from "@/design-system";
import { Row } from '@/design-system/components/layout/Row/Row';

interface MessagesProps {
  text: string;
  isReceived: boolean;
  imageProfile?: string | null;
  localImage?: string | null;
  remoteImage?: string | null;
  uploading?: boolean;
  failed?: boolean;
  receivedBackgroundColor?: keyof typeof theme.colors;
  sentBackgroundColor?: keyof typeof theme.colors;
  receivedTextColor?: keyof typeof theme.colors;
  sentTextColor?: keyof typeof theme.colors;
}

export const Messages = ({
  text,
  isReceived,
  imageProfile,
  localImage,
  remoteImage,
  uploading = false,
  failed = false,
  receivedBackgroundColor = "colorBrandPrimary",
  sentBackgroundColor = "colorGrey100",
  receivedTextColor = "colorBaseWhite",
  sentTextColor = "colorGrey400"
}: MessagesProps) => {

  const avatar = imageProfile ? (
    <Image
      source={{ uri: imageProfile }}
      style={{ width: 32, height: 32, borderRadius: 16 }}
    />
  ) : null;

  const imageToShow = remoteImage ?? localImage ?? null;

  return (
    <Row
      alignItems="flex-end"
      gap="sm"
      marginBottom="md"
      justifyContent={isReceived ? "flex-start" : "flex-end"}
    >
      {isReceived && avatar}

      <Box maxWidth="80%">
        {imageToShow && (
          <Box
            style={{
              width: 180,
              height: 180,
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: failed ? 2 : 0,
              borderColor: failed ? theme.colors.colorFeedbackError : "transparent",
              marginBottom: 8,
            }}
          >
            <Image
              source={{ uri: imageToShow }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />

            {uploading && (
              <Box
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                justifyContent="center"
                alignItems="center"
                backgroundColor="colorBaseBlack"
              >
                <ActivityIndicator size="large" color="white" />
              </Box>
            )}
          </Box>
        )}

        {text ? (
          <Box
            backgroundColor={isReceived ? receivedBackgroundColor : sentBackgroundColor}
            padding="md"
            borderRadius={45}
            borderBottomLeftRadius={isReceived ? 0 : 45}
            borderBottomRightRadius={isReceived ? 45 : 0}
          >
            <Typography
              variant="bodyRegular"
              color={isReceived ? theme.colors[receivedTextColor] : theme.colors[sentTextColor]}
            >
              {text}
            </Typography>
          </Box>
        ) : null}
      </Box>
      {!isReceived && avatar}
    </Row>
  );
};
