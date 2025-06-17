import { IconName } from '@/design-system/components/layout/Icon';
import {ReactNode} from 'react';
import {ViewStyle} from 'react-native';

export interface AuthenticationCardProps {
    mainTitle?: string;
    activeStepIndicator?: boolean;
    currentStep?: number;
    totalSteps?: number;
    labels?: string[];
    title?: string;
    subtitle?: string;
    message?: string;
    primaryButtonText?: string;
    onPrimaryButtonPress: () => void;
    secondaryButtonText?: string;
    onSecondaryButtonPress?: () => void;
    secondaryButtonLeftIcon?: IconName;
    children: ReactNode;
    style?: ViewStyle;
    primaryButtonDisabled?: boolean;
}