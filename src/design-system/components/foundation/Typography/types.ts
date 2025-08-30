import {TextProps as RNTextProps} from 'react-native';

// Variantes predefinidas
export type TypographyVariant =
  | 'headingPrimary'
  | 'headingSecondary'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodyRegular'
  | 'bodySmall'
  | 'button'
  | 'bodyXSmall'
  | 'bodyBold'
  | 'bodyBold16';

export type TypographyColorVariant = 'primary' | 'secondary';

export interface TypographyStylesProps {
  variant: TypographyVariant;
  colorVariant?: TypographyColorVariant;
  color?: string;
  truncate?: boolean;
}

export interface TypographyProps extends TypographyStylesProps, RNTextProps {
  children: React.ReactNode;
}
