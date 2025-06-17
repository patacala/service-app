export interface SubscriptionPlan {
  title: string;
  description: string;
  isBestValue?: boolean;
  isActive?: boolean;
}

export interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onPlanSelect?: (index: number) => void;
}