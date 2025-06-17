import {BoxProps} from '@shopify/restyle';
import {Theme} from '../../../theme';

export type ChipVariant = 'sm' | 'md' | 'lg';

export const CHIP_HEIGHTS = {
  sm: 20,
  md: 40,
  lg: 40,
} as const;

export interface ChipProps extends BoxProps<Theme> {
  selected?: boolean;
  onPress?: () => void;
  variant?: ChipVariant;
  fluid?: boolean;
  children: React.ReactNode;
}
