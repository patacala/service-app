import type {Meta, StoryObj} from '@storybook/react';
import {Input} from './Input';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';
import React from 'react';
import {View} from 'react-native';

Input.displayName = 'Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Forms/Input',
  component: Input,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <View style={{ padding: 16, backgroundColor: '#121212' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['default', 'search', 'password', 'numeric', 'otp', 'date', 'textarea'],
      },
      description: 'Selecciona la variante del componente Input',
      defaultValue: 'default',
    },
    dateMode: {
      control: {
        type: 'select',
        options: ['date', 'time', 'datetime'],
      },
      description: 'Modo de selección para la variante date',
      defaultValue: 'date',
    },
    numberOfLines: {
      control: {
        type: 'number',
        min: 1,
        max: 10,
      },
      description: 'Número de líneas visibles para la variante textarea',
      defaultValue: 4,
    },
    maxLength: {
      control: {
        type: 'number',
        min: 10,
        max: 1000,
      },
      description: 'Límite de caracteres para la variante textarea',
      defaultValue: 500,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
    label: 'Name',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante estándar del input con animación de etiqueta flotante. La etiqueta se eleva y reduce al escribir o enfocar.',
      },
    },
  },
};

export const Search: Story = {
  args: {
    placeholder: 'Type your search',
    variant: 'search',
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo de búsqueda con icono de lupa integrado, al aplicar escritura se activa el icono clear para limpiar el campo.',
      },
    },
  },
};

export const Numeric: Story = {
  args: {
    placeholder: 'Enter amount',
    label: 'Amount',
    variant: 'numeric'
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo numérico que activa automáticamente el teclado de números. Ideal para cantidades, precios y otros valores numéricos.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter your email',
    label: 'Email',
    error: 'Please enter a valid email address',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Muestra un estado de error con borde rojo y mensaje explicativo debajo del campo.',
      },
    },
  },
};

export const Password: Story = {
  args: {
    placeholder: 'Enter your password',
    label: 'Password',
    variant: 'password',
    secureTextEntry: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo de contraseña con funcionalidad para mostrar y ocultar el texto mediante un botón de alternancia.',
      },
    },
  },
};

export const OTPVerification: Story = {
  args: {
    variant: 'otp',
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo para códigos de verificación con formato OTP.',
      },
    },
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Input with icon right',
    label: 'Search',
    icon: 'search'
  },
  parameters: {
    docs: {
      description: {
        story: 'Activar icono a la derecha.',
      },
    },
  },
};

export const Date: Story = {
  args: {
    placeholder: 'Select date',
    label: 'Date',
    variant: 'date',
    dateMode: 'date',
    onDateChange: (date) => console.log('Fecha seleccionada:', date)
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo para selección de fechas con componente DatePicker integrado.',
      },
    },
  },
};

export const Time: Story = {
  args: {
    placeholder: 'Select time',
    label: 'Time',
    variant: 'date',
    dateMode: 'time',
    onDateChange: (date) => console.log('Hora seleccionada:', date)
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo para selección de hora con componente TimePicker integrado.',
      },
    },
  },
};

export const DateTime: Story = {
  args: {
    placeholder: 'Select date and time',
    label: 'Date & Time',
    variant: 'date',
    dateMode: 'datetime',
    onDateChange: (date) => console.log('Fecha y hora seleccionadas:', date)
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo para selección tanto de fecha como hora en secuencia. En iOS muestra pestañas para alternar entre ambos selectores.',
      },
    },
  },
};

export const Textarea: Story = {
  args: {
    placeholder: 'Write here',
    label: 'Description',
    variant: 'textarea',
    numberOfLines: 4,
    maxLength: 500,
  },
  parameters: {
    docs: {
      description: {
        story: 'Campo de texto multilínea con contador de caracteres. Ideal para descripciones largas, comentarios o biografías.',
      },
    },
  },
};