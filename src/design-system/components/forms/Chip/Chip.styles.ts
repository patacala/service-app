import {Theme} from '../../../theme';
import {ChipVariant} from './types';

export const CHIP_HEIGHTS = {
  sm: 20,
  md: 40,
  lg: 40,
} as const;

export const getChipStyles = (
  theme: Theme,
  {
    variant = 'md',
    selected = false,
  }: {
    variant?: ChipVariant;
    selected?: boolean;
  },
) => ({
  container: {
    height: CHIP_HEIGHTS[variant],
    backgroundColor: selected
      ? theme.colors.colorBaseWhite
      : theme?.colors.colorGrey600,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.border.radius.pill,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
  },
});
