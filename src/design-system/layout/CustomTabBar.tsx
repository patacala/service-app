// src/design-system/components/layout/CustomTabBar.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Importaciones del Design System
import { Icon, IconName } from '@/design-system/components/layout/Icon';
import { Typography } from '@/design-system/components/foundation/Typography';
import { Box, theme } from '@/design-system';
import { MainTabParamList } from '@/types/navigation';
import { useTranslation } from 'react-i18next';

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
    const { t } = useTranslation('auth');
    const insets = useSafeAreaInsets();
  
    const renderTabItem = (routeName: keyof MainTabParamList, label: string, iconName: IconName) => {
      const routeIndex = state.routes.findIndex(route => route.name === routeName);
      const isFocused = state.index === routeIndex;
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
              <Typography variant="bodyMedium" color="colorBaseBlack" style={styles.tabLabel}>
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
          {renderTabItem('provider-mode', t("tabs.provmode"), 'transfer')}
          {renderTabItem('services', t("tabs.services"), 'bookmark-other')}
          {renderTabItem('profile', t("tabs.profile"), 'user-circle')}
          {renderTabItem('home', t("tabs.home"), 'home')}
        </Box>
      </Box>
    );
};
  
// Estilos que necesita el componente
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
});