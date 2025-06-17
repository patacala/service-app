import { TypographyVariant } from '../../foundation/Typography/types';
import { IconName } from '../../layout/Icon';

export interface ChipOption {
  id: string;
  label: string;
  icon?: IconName;
}

export interface ChipSelectorProps {
  options: ChipOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  error?: string;
  variant?: 'vertical' | 'horizontal';
  textVariant?: TypographyVariant;
  noPadding?: boolean;
  noGap?: boolean;
  noScroll?: boolean;
  maxHeight?: number;
}