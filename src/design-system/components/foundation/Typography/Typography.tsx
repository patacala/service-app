import React from 'react';
import { Text, Platform } from 'react-native';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '../../../theme';
import type { TypographyProps } from './types';
import { getTypographyStyles } from './Typography.styles';

export const Typography: React.FC<TypographyProps> = ({
  variant,
  colorVariant = 'primary',
  color,
  style,
  truncate,
  numberOfLines,
  ellipsizeMode,
  ...props
}) => {
  const theme = useTheme<Theme>();
  const styles = getTypographyStyles(theme, {
    variant,
    colorVariant,
    color: color as string,
  });

  const webFontFamily = styles.text.fontFamily + ', sans-serif';

  return (
    <Text
      style={[
        styles.text,
        Platform.select({
          web: {
            ...styles.text,
            fontFamily: webFontFamily,
          },
        }),
        style,
      ]}
      numberOfLines={truncate ? 1 : numberOfLines}
      ellipsizeMode={truncate ? 'tail' : ellipsizeMode}
      {...props}
    />
  );
};
