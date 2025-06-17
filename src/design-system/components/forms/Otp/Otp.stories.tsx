import type {Meta, StoryObj} from '@storybook/react';
import {Otp} from './Otp';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';

const meta: Meta<typeof Otp> = {
  title: 'Components/Forms/Otp',
  component: Otp,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Otp>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'OTP en su variante default. Permite ingresar un código numérico en 4 campos separados con enfoque automático continuo y cierre del teclado al completarse.',
      },
    },
  },
};

export const moreDigits: Story = {
  args: {
    variant: 'default',
    qtyDigits: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'OTP con soporte para más de 4 dígitos.',
      },
    },
  },
};

