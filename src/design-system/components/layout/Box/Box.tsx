import React from 'react';
import {createBox, useTheme} from '@shopify/restyle';
import {Theme} from '../../../theme';
import {getBoxStyles, BoxVariant} from './Box.styles';
import {ViewStyle} from 'react-native';

const RestyleBox = createBox<Theme>();

export type BoxProps = React.ComponentProps<typeof RestyleBox> & {
  variant?: BoxVariant;
  style?: ViewStyle | ViewStyle[];
};

export const Box: React.FC<BoxProps> = ({
  variant = 'clean',
  style,
  ...props
}) => {
  const theme = useTheme<Theme>();
  const variantStyles = getBoxStyles(theme, variant);

  return <RestyleBox style={[variantStyles, style]} {...props} />;
};
