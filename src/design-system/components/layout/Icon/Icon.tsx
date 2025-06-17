import React from 'react';
import {Text} from 'react-native';
import {createBox, useTheme} from '@shopify/restyle';
import {Theme} from '../../../theme';
import {IconName, ICON_MAP} from './types';

const Box = createBox<Theme>();

export interface IconProps {
  name: IconName;
  size?: number;
  color?: keyof Theme['colors'];
  fillColor?: keyof Theme['colors']; // Nuevo prop para color interno opcional
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'colorTextPrimary',
  fillColor,
}) => {
  const theme = useTheme<Theme>();
  const iconCode = ICON_MAP[name];

  if (!iconCode) {
    return null;
  }

  return (
    <Box alignItems="center" justifyContent="center">
      <Text
        style={{
          fontFamily: 'CustomIcons',
          fontSize: size,
          color: theme.colors[color],
          backgroundColor: fillColor ? theme.colors[fillColor] : undefined,
          textAlign: 'center',
          lineHeight: size,
          height: size,
          width: size,
        }}>
        {String.fromCharCode(parseInt(iconCode, 16))}
      </Text>
    </Box>
  );
};