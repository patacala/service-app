import React from 'react';
import { Image, ImageSourcePropType } from "react-native";
import { Box, theme, Typography } from "@/design-system";
import { Row } from '@/design-system/components/layout/Row/Row';

interface MessagesProps {
  text: string;
  isReceived: boolean;
  image?: ImageSourcePropType;
  receivedBackgroundColor?: keyof typeof theme.colors;
  sentBackgroundColor?: keyof typeof theme.colors;
  receivedTextColor?: keyof typeof theme.colors;
  sentTextColor?: keyof typeof theme.colors;
}

export const Messages = ({
  text,
  isReceived,
  image,
  receivedBackgroundColor = "colorBrandPrimary",
  sentBackgroundColor = "colorGrey100",
  receivedTextColor = "colorBaseWhite",
  sentTextColor = "colorGrey400"
}: MessagesProps) => {
  const avatar = image ? (
    <Image
      source={image}
      style={{ width: 32, height: 32, borderRadius: 16 }}
    />
  ) : null;

  if (isReceived) {
    return (
      <Row alignItems="flex-end" gap="sm" marginBottom="md" justifyContent="flex-start">
        {avatar}
        <Box
          backgroundColor={receivedBackgroundColor}
          padding="md"
          borderRadius={45}
          borderBottomLeftRadius={0}
          maxWidth="80%"
        >
          <Typography variant="bodyRegular" color={theme.colors[receivedTextColor]}>
            {text}
          </Typography>
        </Box>
      </Row>
    );
  }

  return (
    <Row alignItems="flex-end" gap="sm" marginBottom="md" justifyContent="flex-end">
      <Box
        backgroundColor={sentBackgroundColor}
        padding="md"
        borderRadius={45}
        borderBottomRightRadius={0}
        maxWidth="80%"
      >
        <Typography variant="bodyRegular" color={theme.colors[sentTextColor]}>
          {text}
        </Typography>
      </Box>
      {avatar}
    </Row>
  );
};
