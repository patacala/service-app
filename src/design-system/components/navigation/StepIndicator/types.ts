import { IconName } from "@/assembler/navigation/types";

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}
