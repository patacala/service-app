import React from 'react';
import { useTheme } from '@shopify/restyle';

// Design System
import { Box, Typography, Theme } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import { SubscriptionPlan, SubscriptionPlansProps } from './types';

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  plans,
  onPlanSelect 
}) => {
  const theme = useTheme<Theme>();

  const renderPlan = (plan: SubscriptionPlan, index: number) => {
    return (
      <Box
        key={index}
        width="100%"
        height={92}
        backgroundColor={plan.isBestValue ? "colorBrandPrimary" : undefined}
        borderWidth={!plan.isBestValue ? 2 : undefined}
        borderColor={!plan.isBestValue ? "colorGrey500" : undefined}
        borderRadius={16}
        justifyContent="center"
        alignItems="flex-start"
        padding="lg"
        gap="sm"
        style={!plan.isBestValue ? { backgroundColor: "rgba(128, 128, 128, 0.2)" } : undefined}
        onTouchEnd={() => onPlanSelect && onPlanSelect(index)}
      >
        <Row width="100%" justifyContent="space-between" alignItems="center">
          <Row>
            <Typography 
              variant="bodyBold16" 
              color={theme.colors.colorBaseWhite}
            >
              {plan.title}
            </Typography>

            {/* Best Value */}
            {plan.isBestValue && (
              <Box
                height={26}
                paddingHorizontal="sm"
                borderRadius={50}
                justifyContent="center"
                alignItems="center"
                style={{ backgroundColor: "rgba(69, 33, 171, 0.3)" }}
              >
                <Typography 
                  variant="bodyMedium"
                  color={theme.colors.colorBaseWhite}
                >
                  Best Value
                </Typography>
              </Box>
            )}
          </Row>
        
          {/* Active - aparece siempre si isActive es true */}
          {plan.isActive && plan.isBestValue && (
            <Box
              height={26}
              backgroundColor="colorBaseWhite"
              paddingHorizontal="sm"
              borderRadius={50}
              justifyContent="center"
              alignItems="center"
            >
              <Typography 
                variant="bodyMedium"
                color={theme.colors.colorBaseBlack}
              >
                Active
              </Typography>
            </Box>
          )}

          {plan.isActive && !plan.isBestValue && (
            <Box
              height={26}
              backgroundColor="colorBaseBlack"
              paddingHorizontal="sm"
              borderRadius={50}
              justifyContent="center"
              alignItems="center"
            >
              <Typography 
                variant="bodyMedium"
                color={theme.colors.colorBaseWhite}
              >
                Active
              </Typography>
            </Box>
          )}
        </Row>
        
        <Typography 
          variant="bodyRegular" 
          color={theme.colors.colorGrey100}
        >
          {plan.description}
        </Typography>
      </Box>
    );
  };

  return (
    <Box gap="md">
      {plans.map((plan, index) => renderPlan(plan, index))}
    </Box>
  );
};

export type { SubscriptionPlan, SubscriptionPlansProps };