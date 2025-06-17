import type {Meta, StoryObj} from '@storybook/react';
import {StepIndicator} from './StepIndicator';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';

const meta: Meta<typeof StepIndicator> = {
  title: 'Components/Navigation/StepIndicator',
  component: StepIndicator,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StepIndicator>;

export const Default: Story = {
  args: {
    currentStep: 0,
    totalSteps: 3,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: theme?.colors.colorBaseBlack },
      ],
    },
  },
};

export const StepOne: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: theme?.colors.colorBaseBlack },
      ],
    },
  },
};

export const StepTwo: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: theme?.colors.colorBaseBlack },
      ],
    },
  },
};

export const StepThree: Story = {
  args: {
    currentStep: 3,
    totalSteps: 3,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: theme?.colors.colorBaseBlack },
      ],
    },
  },
};

export const StepLabels: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
    labels:['INFO', 'SKILLS', 'OTP']
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: theme?.colors.colorBaseBlack },
      ],
    },
  },
};
