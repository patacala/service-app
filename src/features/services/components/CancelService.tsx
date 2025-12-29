import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { Box, Typography, Button, BottomModal } from "@/design-system";
import images from "@/assets/images/images";

interface CancelServiceProps {
  visible: boolean;
  onClose: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CancelService: React.FC<CancelServiceProps> = ({
  visible,
  onClose,
  onCancel = () => console.log("Service cancelled"),
  isLoading = false,
}) => {
    const handleCancel = () => {
        if (!isLoading) {
            onCancel();
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
                <Typography variant="headingPrimary" color="white">Cancel Service</Typography>

                <Box maxWidth={291}>
                    <Typography style={{ textAlign: "center" }} variant="bodyMedium" color="white">Are you sure you want to cancel this service? This step is irreversible</Typography>
                </Box>
                
                <Box width="100%">
                    <Button
                        variant="secondary"
                        label={isLoading ? "Cancelling..." : "Cancel Service"}
                        onPress={handleCancel}
                        disabled={isLoading}
                    />
                </Box>
            </Box>
        </BottomModal>
    );
};