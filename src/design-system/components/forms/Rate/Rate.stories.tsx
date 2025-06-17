import type { Meta, StoryObj } from '@storybook/react';
import { Rate } from './Rate';
import { ThemeProvider } from '@shopify/restyle';
import { theme } from '../../../theme';

const meta: Meta<typeof Rate> = {
  title: 'Components/Forms/Rate',
  component: Rate,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Rate>;

export const Default: Story = {
  args: {
    defaultRating: 0,
    maxRating: 5,
    size: 30,
    showLabel: true,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Componente de calificación por estrellas en su configuración predeterminada, mostrando una etiqueta y permitiendo seleccionar hasta 5 estrellas.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    defaultRating: 4,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Versión del componente de calificación en modo deshabilitado. No se permite cambiar la puntuación.',
      },
    },
  },
};

export const NoLabel: Story = {
  args: {
    defaultRating: 2,
    showLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo del componente sin mostrar etiqueta de calificación ni texto de ayuda.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    size: 48,
    defaultRating: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Componente de calificación con estrellas más grandes, útil para pantallas accesibles o diseños destacados.',
      },
    },
  },
};
