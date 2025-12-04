import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Box, Button, Theme, Typography } from '@/design-system';
import images from '@/assets/images/images';

// Interfaz para los valores iniciales
interface InitialValues {
  selectedServiceId?: string;
  dateTime?: Date | null;
  address?: string;
  comments?: string;
}

interface FormServiceProps {
  onButtonPress?: () => void;
}

export const ContactProvider: React.FC<FormServiceProps> = ({
  onButtonPress,
}) => {
  const theme = useTheme<Theme>();
  const styles = createStyles(theme);

  const onButtonPressAction = () => {
    if (onButtonPress) {
        onButtonPress();
    }
  }
  
  return (
    <>
        <Box justifyContent="center" alignItems="center" gap="xl" paddingTop="lg">
            <Image
                source={images.withoutResult as ImageSourcePropType}
                resizeMode="contain"
            />

            <Box alignItems="center" gap="xl" maxWidth="80%" marginBottom="lg">
                <Typography variant="headingPrimary" color={theme.colors.colorBaseWhite}>Booking completed</Typography>
                <Typography style={styles.centerText} variant="bodyMedium" color={theme.colors.colorBaseWhite}>
                    Your service is confirmed, please contact the supplier to arrange the service
                </Typography>
            </Box>

            <Box width="100%">
                <Button
                    variant="secondary"
                    label={"Contact Provider"}
                    onPress={() => onButtonPressAction()}
                />
            </Box>
        </Box>
    </>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  centerText: {
    textAlign: "center"
  }
});