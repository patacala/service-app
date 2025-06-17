import React from 'react';
import {createBox} from '@shopify/restyle';
import {Theme, theme} from '../../../theme';
import {Typography} from '../../foundation/Typography';
import {Icon} from '../../layout/Icon';
import type {StepIndicatorProps} from './types';
import {useTranslation} from 'react-i18next';

const Box = createBox<Theme>();

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels = [],
  ...props
}) => {
  const {t} = useTranslation('auth');

  return (
    <Box 
      flexDirection="row" 
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      {Array.from({length: totalSteps}).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isPast = stepNumber < currentStep;
        const isLast = stepNumber === totalSteps;
        const label = labels[index] || t('signup.labelStep');

        return (
          <React.Fragment key={stepNumber}>
            {/* Contenedor del paso con etiqueta */}
            <Box flexDirection="row" alignItems="center">

              {/* Etiqueta del paso */}
              <Box marginLeft="xs" flexDirection='row' gap='xs'>
                <Typography 
                  variant="bodyRegular"
                  color={
                    isActive ? theme?.colors.colorBaseWhite : 
                    isPast ? theme?.colors.colorBaseWhite : theme?.colors.colorGrey200
                  }
                >
                  {label}
                </Typography>
                <Typography
                  variant="bodyRegular"
                  color={
                    isActive ? theme?.colors.colorBaseWhite : 
                    isPast ? theme?.colors.colorBaseWhite : theme?.colors.colorGrey200
                }>
                  {stepNumber}
                </Typography>
              </Box>
            </Box>

            {/* Icono entre pasos */}
            {!isLast && (
              <Box
                marginHorizontal="sm"
                alignItems="center"
                justifyContent="center"
              >
                <Icon 
                    name="right-arrow" 
                    color={
                      isActive ? 'colorBaseWhite' : 
                      isPast ? 'colorBaseWhite' : "colorGrey200"
                    }
                    size={22}
                />
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};