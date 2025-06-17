import type {Meta, StoryObj} from '@storybook/react';
import {Stack} from './Stack';
import {Box} from '../../layout/Box/Box';
import {Typography} from '../../foundation/Typography';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';

const meta: Meta<typeof Stack> = {
  title: 'Components/Layout/Stack',
  component: Stack,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Stack>;

// Ejemplo de formulario como en la imagen
export const FormLayout: Story = {
  args: {
    spacing: 'lg',
    children: (
      <Stack spacing="lg">
        <Typography variant="headingPrimary" color="colorTextPrimary">
          Lets get started
        </Typography>
        <Box
          backgroundColor="colorBackgroundSecondary"
          padding="md"
          borderRadius={theme.border.radius.md}>
          <Typography variant="bodyRegular">Name</Typography>
        </Box>
        <Box
          backgroundColor="colorBackgroundSecondary"
          padding="md"
          borderRadius={theme.border.radius.md}>
          <Typography variant="bodyRegular">Email</Typography>
        </Box>
        <Box
          backgroundColor="colorBackgroundSecondary"
          padding="md"
          borderRadius={theme.border.radius.md}>
          <Typography variant="bodyRegular">Password</Typography>
        </Box>
      </Stack>
    ),
  },
};

// Ejemplo de grid de servicios como en la imagen
export const ServicesGrid: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'sm',
    wrap: true,
    children: (
      <Stack spacing="sm" wrap={true}>
        {[
          'Housekeeping',
          'Plumbing',
          'Tutor',
          'Coaching',
          'Fitness Trainer',
          'Gardening',
        ].map(service => (
          <Box
            key={service}
            backgroundColor="colorBackgroundSecondary"
            padding="md"
            borderRadius={theme.border.radius.md}
            width={100}>
            <Typography variant="bodySmall" color="colorTextPrimary">
              {service}
            </Typography>
          </Box>
        ))}
      </Stack>
    ),
  },
};
