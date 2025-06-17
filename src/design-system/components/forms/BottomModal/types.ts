import { ReactNode } from "react";
import { IconName } from "../../layout/Icon/types";
import type { ButtonProps } from '@/design-system';

export type ButtonVariant = NonNullable<ButtonProps['variant']>;
export interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  topText?: string;
  title?: string;
  subtitle?: string;
  showCloseButton?: boolean;
  children: ReactNode;
  height?: number | string;
  disableBackdropPress?: boolean;
  animationType?: "slide" | "fade" | "none";
  enableScroll?: boolean;
  draggable?: boolean;
  activateSteps?: boolean;
  stepPosition?: 'header' | 'belowTitle';
  currentStep?: number;
  totalSteps?: number;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonIcon?: IconName;
  secondaryButtonIcon?: IconName;
  onPrimaryButtonPress?: () => void;
  onSecondaryButtonPress?: () => void;
  showPrimaryButton?: boolean;
  showSecondaryButton?: boolean;
  primaryButtonVariant?: ButtonVariant;
  secondaryButtonVariant?: ButtonVariant;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
}