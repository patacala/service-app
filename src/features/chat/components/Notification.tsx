import React, { ReactNode } from 'react';
import { Box, Typography, theme } from "@/design-system";

interface NotificationProps {
  title: string;
  children: ReactNode;
  backgroundColor?: keyof typeof theme.colors;
  titleColor?: keyof typeof theme.colors;
  borderColor?: keyof typeof theme.colors;
}

export const Notification = ({
  title,
  children,
  backgroundColor = "colorGrey500",
  titleColor = "colorGrey200",
  borderColor = "colorGrey200"
}: NotificationProps) => {
  return (
    <Box 
      backgroundColor={backgroundColor}
      width="100%" 
      padding="md" 
      marginBottom="lg" 
      borderRadius={16} 
      borderColor={borderColor}
      borderWidth={1}
    >
      <Box marginBottom="sm">
        <Typography variant="bodyRegular" color={theme.colors[titleColor]}>
          {title}
        </Typography>
      </Box>
      <Box>
        {children}
      </Box>
    </Box>
  );
};