import type {Meta, StoryObj} from '@storybook/react';
import {SendCode} from './SendCode';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';

const meta: Meta<typeof SendCode> = {
    title: 'Components/Forms/SendCode',
    component: SendCode,
    decorators: [
      Story => (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      ),
    ],
};

export default meta;
type Story = StoryObj<typeof SendCode>;

export const Default: Story = {
  args: {
    delaySeconds: 60,
    maxAttempts: 3,
    onSend: () => console.log('Código enviado'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Componente para gestionar el envío de códigos con retardo entre intentos y un límite máximo de envíos.',
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