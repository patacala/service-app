import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { WallScreen } from '../../features/wall';
import { ProvModeScreen } from '../../features/provMode';
import { ProfileScreen } from '../../features/profile';
import { ServicesDetailScreen } from '@/features/detail';
import { Icon, IconName } from '../../design-system/components/layout/Icon';
import { Typography } from '../../design-system/components/foundation/Typography';
import { MainTabParamList } from './types';
import { Box, SafeContainer, theme } from '@/design-system';
import { ServicesScreen } from '@/features/services';
import { Row } from '@/design-system/components/layout/Row/Row';
import images from '@/assets/images/images';
import { LocationPanel } from '@/features/wall/components/LocationPanel';
import { RootState } from '@/store';
import { setLocation } from '@/features/location/slices/location.slice';
import { ChatScreen } from '@/features/chat';
import { useGetCurrentUserQuery } from '@/features/auth/store';

const Tab = createBottomTabNavigator<MainTabParamList>();
const MainStack = createNativeStackNavigator();

interface Location {
  id: string;
  name: string;
}

export interface InjectedScreenProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
}

const ScreenWrapper: React.FC<{ 
  children: React.ReactElement<InjectedScreenProps>;
  showHeader?: boolean;
  showRating?: boolean;
  rating?: number;
}> = ({ children, showHeader = true, showRating = false, rating = 0 }) => {
  const [locationPanelVisible, setLocationPanelVisible] = useState(false);
  const dispatch = useDispatch();
  const currentLocation = useSelector((state: RootState) => state.location.currentLocation);
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetCurrentUserQuery();

  const handleSelectLocation = (location: Location) => {
    dispatch(setLocation(location));
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning,';
    } else {
      return 'Good Afternoon,';
    }
  };

  return (
    <SafeContainer
      fluid
      backgroundColor="colorBaseBlack"
      paddingHorizontal="md" 
    >
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
                {getGreeting()}
              </Typography>
              
              {!isProfileLoading && profile?.name && (
                <Typography variant="bodyMedium" color="white">
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
                  <Typography variant="bodySmall" color="white">4.2</Typography>
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
      
      {/* Ahora TypeScript ya no dará error aquí */}
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

const CustomTabBar = ({ navigation, state }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();
  
    const getIsFocused = (routeName: string) => {
      const currentRoute = state.routes[state.index];
      return currentRoute.name === routeName;
    };
  
    const renderTabItem = (routeName: keyof MainTabParamList, label: string, iconName: IconName) => {
      const isFocused = getIsFocused(routeName);
      const color = isFocused ? 'colorBaseBlack' : 'colorBaseWhite';
  
      return (
        <TouchableOpacity
          key={routeName}
          accessibilityRole="button"
          accessibilityLabel={`Go to ${label}`}
          style={isFocused ? styles.activeTabButton : styles.tabButton}
          onPress={() => {
            if (!isFocused) {
              navigation.navigate(routeName);
            }
          }}
        >
          <Box flexDirection="row" alignItems="center">
            <Icon name={iconName} size={24} color={color} />
            {isFocused && (
              <Typography
                variant="bodyMedium"
                color="colorBaseBlack"
                style={styles.tabLabel}
              >
                {label}
              </Typography>
            )}
          </Box>
        </TouchableOpacity>
      );
    };
  
    return (
      <Box style={[styles.tabContainer, { bottom: insets.bottom - 20 }]}>
        <Box 
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={styles.tabBar}
        >
          {renderTabItem('ProviderMode', 'Provider Mode', 'transfer')}
          {renderTabItem('Services', 'Services', 'bookmark-other')}
          {renderTabItem('Profile', 'Profile', 'user-circle')}
          {renderTabItem('Wall', 'Home', 'home')}
        </Box>
      </Box>
    );
  };
  
  const ProvModeWithHeader = (props: any) => (
    <ScreenWrapper>
      <ProvModeScreen {...props} />
    </ScreenWrapper>
  );
  
  const ServicesWithHeader = (props: any) => (
    <ScreenWrapper>
      <ServicesScreen {...props} />
    </ScreenWrapper>
  );
  
  const ProfileWithHeader = (props: any) => (
    <ScreenWrapper showRating={true} rating={4.2}>
      <ProfileScreen {...props} />
    </ScreenWrapper>
  );
  
  const WallWithHeader = (props: any) => (
    <ScreenWrapper>
      <WallScreen {...props} />
    </ScreenWrapper>
  );
  
  const TabNavigator = () => (
    <Tab.Navigator
      initialRouteName="Wall"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="ProviderMode" component={ProvModeWithHeader} />
      <Tab.Screen name="Services" component={ServicesWithHeader} />
      <Tab.Screen name="Profile" component={ProfileWithHeader} />
      <Tab.Screen name="Wall" component={WallWithHeader} />
    </Tab.Navigator>
  );
  
  export const MainNavigator = () => (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={TabNavigator} />
      <MainStack.Screen name="ServiceDetail" component={ServicesDetailScreen} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
    </MainStack.Navigator>
  );
  
  const styles = StyleSheet.create({
    tabContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      zIndex: 1000,
    },
    tabBar: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: theme.colors.colorGrey600,
      borderRadius: 30,
      marginHorizontal: 16,
      marginBottom: 10,
      height: 72,
    },
    tabButton: {
      padding: 8,
    },
    activeTabButton: {
      padding: 8,
      backgroundColor: theme.colors.colorBaseWhite,
      borderRadius: 20,
      paddingHorizontal: 16,
    },
    tabLabel: {
      marginLeft: 8,
    },
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