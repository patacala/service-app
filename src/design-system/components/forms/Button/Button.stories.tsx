import type {Meta, StoryObj} from '@storybook/react';
import {Button} from './Button';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';
import { View } from 'react-native';

const meta: Meta<typeof Button> = {
  title: 'Components/Forms/Button',
  component: Button,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'outlined', 'ghost', 'ghostWithout', 'centerIconOnly', 'transparent', 'slide'],
      control: {type: 'select'},
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: {type: 'select'},
    },
    centerIcon: {
      control: {type: 'text'},
      description: 'Nombre del icono o componente React',
    },
    leftIcon: {
      control: {type: 'text'},
      description: 'Nombre del icono o componente React',
    },
    rightIcon: {
      control: {type: 'text'},
      description: 'Nombre del icono o componente React',
    },
    slideBackgroundColor: {
      control: {type: 'color'},
      description: 'Color del fondo del botón slide (solo para variant="slide")',
    },
    width: {
      control: {type: 'number'},
      description: 'Ancho del botón (solo para variant="slide")',
    },
    height: {
      control: {type: 'number'},
      description: 'Altura del botón (solo para variant="slide")',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Continue',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón primario con estilo sólido, ideal para acciones principales.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Go back',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón secundario con fondo claro, ideal para acciones menos prioritarias.',
      },
    },
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    label: 'Outlined Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con borde y sin relleno, útil para acciones opcionales.',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    label: 'Ghost Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón transparente sin borde, para acciones muy secundarias.',
      },
    },
    backgrounds: {
      default: 'black',
      values: [
        { name: 'black', value: '#000000' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export const ghostWithout: Story = {
  args: {
    variant: 'ghostWithout',
    label: 'Ghost Without Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante personalizada del botón tipo ghost.',
      },
    },
    backgrounds: {
      default: 'black',
      values: [
        { name: 'black', value: '#000000' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export const withLeftIcon: Story = {
  args: {
    variant: 'outlined',
    label: 'Icon Button',
    leftIcon: 'left-arrow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con icono a la izquierda del texto.',
      },
    },
  },
};

export const withRightIcon: Story = {
  args: {
    variant: 'outlined',
    label: 'Icon Button',
    rightIcon: 'right-arrow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con icono a la derecha del texto.',
      },
    },
  },
};

export const centerIconOnly: Story = {
  args: {
    variant: 'centerIconOnly',
    label: '',
    centerIcon: 'left-arrow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón que muestra únicamente un icono centrado, sin texto.',
      },
    },
  },
};

export const SlideToReject: Story = {
  args: {
    variant: 'slide',
    label: 'Reject',
    leftIcon: 'close',
    onPress: () => console.log('Acción rechazada'),
    slideBackgroundColor: '#470517',
    width: 350,
    height: 56
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón deslizable para rechazar. Desliza el círculo hacia la derecha para completar la acción.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#222222' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};

export const SlideToAccept: Story = {
  args: {
    variant: 'slide',
    label: 'Accept',
    leftIcon: 'checkmark',
    onPress: () => console.log('Acción aceptada'),
    slideBackgroundColor: '#1E6C0B',
    width: 350,
    height: 56
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón deslizable para aceptar. Desliza el círculo hacia la derecha para completar la acción.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#222222' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};