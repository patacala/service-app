import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { Box, Typography, Button, BottomModal } from "@/design-system";
import images from "@/assets/images/images";

interface CompletedServiceProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
  isLoading?: boolean;
}

export const CompletedService: React.FC<CompletedServiceProps> = ({
  visible,
  onClose,
  onComplete = () => console.log("Service completed"),
  isLoading = false,
}) => {
    const handleCancel = () => {
        if (!isLoading) {
            onComplete();
        }
    };

    return (
        <BottomModal
            visible={visible}
            onClose={onClose}
            enableScroll={false}
            height={530}
        >
            <Box alignItems="center" justifyContent="flex-start" gap="xl" paddingTop="sm" height="100%">
                <Image
                    source={images.withoutResult as ImageSourcePropType}
                    resizeMode="contain"
                />
                <Typography variant="headingPrimary" color="white">Completed Service</Typography>

                <Box maxWidth={291}>
                    <Typography style={{ textAlign: "center" }} variant="bodyMedium" color="white">Are you sure you want to complete this service? This action will confirm it as finished.</Typography>
                </Box>
                
                <Box width="100%">
                    <Button
                        variant="secondary"
                        label={isLoading ? "Completing..." : "Completed Service"}
                        onPress={handleCancel}
                        disabled={isLoading}
                    />
                </Box>
            </Box>
        </BottomModal>
    );
};