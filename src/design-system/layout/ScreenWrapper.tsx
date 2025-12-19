// src/design-system/components/layout/ScreenWrapper.tsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Importaciones del Design System y de la Lógica de la App
import { Icon } from '@/design-system/components/layout/Icon';
import { Typography } from '@/design-system/components/foundation/Typography';
import { Box, SafeContainer, theme } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import images from '@/assets/images/images';
import { LocationPanel } from '@/features/wall/components/LocationPanel';
import { RootState } from '@/store';
import { setLocation } from '@/features/location/slices/location.slice';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { useUserProfile } from '@/features/auth/hooks/useUserProfile';

interface Location {
  id: string;
  name: string;
}

export interface InjectedScreenProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
}

export const ScreenWrapper: React.FC<{ 
  children: React.ReactElement<InjectedScreenProps>;
  showHeader?: boolean;
  showRating?: boolean;
  rating?: number;
}> = ({ children, showHeader = true, showRating = false, rating = 0 }) => {
  const [locationPanelVisible, setLocationPanelVisible] = useState(false);
  const dispatch = useDispatch();
  const currentLocation = useSelector((state: RootState) => state.location.currentLocation);
  const { profile } = useAuth();
  useUserProfile();
  
  const handleSelectLocation = (location: Location) => {
    dispatch(setLocation(location));
  };

  const Greeting = () => {
    const [greeting, setGreeting] = useState(getGreeting());

    function getGreeting() {
      const currentHour = new Date().getHours();
      return currentHour < 12 ? "Good Morning," : "Good Afternoon,";
    }

    useEffect(() => {
      const interval = setInterval(() => setGreeting(getGreeting()), 60000);
      return () => clearInterval(interval);
    }, []);

    return greeting;
  };

  return (
    <SafeContainer fluid backgroundColor="colorBaseBlack" paddingHorizontal="md">
      {showHeader && (
        <Box>
          <Row justifyContent="space-between">
            <Image
              source={images.gradientBlueAndPurple as ImageSourcePropType}
              resizeMode="contain"
              style={styles.backgroundImage}
            />
            <Box width="100%" maxWidth={200}>
              <Typography variant="headingSecondary" color="white">
                {Greeting()}
              </Typography>
              {profile?.name && (
                <Typography variant="bodyMedium" color="white" truncate>
                  {profile.name}
                </Typography>
              )}
            </Box>
            <Box>
              {showRating ? (
                <Box paddingLeft="sm" flexDirection="row" justifyContent="center" alignItems="center" style={styles.rating}>
                  <Box paddingRight="xs">
                    <Icon name="star" size={14} color="colorBaseWhite" />
                    <Box style={styles.secondStar}>
                      <Icon name="star" fillColor="colorBaseBlack" size={14} color='colorBaseWhite' />
                    </Box>
                  </Box>
                  <Typography variant="bodySmall" color="white">{rating}</Typography>
                </Box>
              ) : (
                <TouchableOpacity onPress={() => setLocationPanelVisible(true)}>
                  <Row flexDirection="row" gap="xs" alignItems="center">
                    <Typography variant="bodyMedium" color="white">
                      {currentLocation.name}
                    </Typography>
                    <Icon name="location" color="colorBaseWhite" size={24} />
                  </Row>
                </TouchableOpacity>
              )}
            </Box>
          </Row>
        </Box>
      )}
      
      {React.cloneElement(children, { 
          currentLocation,
          onLocationChange: handleSelectLocation 
      })}

      <LocationPanel
        visible={locationPanelVisible}
        onClose={() => setLocationPanelVisible(false)}
        onSelectLocation={handleSelectLocation}
        currentLocation={currentLocation}
      />
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: -60,
    right: -70,
  },
  rating: {
    position: "relative",
    backgroundColor: theme.colors.colorBaseBlack,
    width: 55,
    height: 20,
    borderRadius: 40
  },
  secondStar: {
    position: 'absolute',
    left: -7,
  }
});