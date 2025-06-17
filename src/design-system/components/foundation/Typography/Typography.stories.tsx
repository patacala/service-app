import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from './Typography';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';
import {Stack} from '../../layout/Stack/Stack';

const meta: Meta<typeof Typography> = {
  title: 'Components/Foundation/Typography',
  component: Typography,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Headings: Story = {
  render: () => (
    <Stack spacing="md">
      <Typography variant="headingPrimary">Heading Primary</Typography>
      <Typography variant="headingSecondary">Heading Secondary</Typography>
    </Stack>
  ),
};

export const Body: Story = {
  render: () => (
    <Stack spacing="md">
      <Typography variant="bodyLarge">Body Large Text</Typography>
      <Typography variant="bodyMedium">Body Medium Text</Typography>
      <Typography variant="bodyRegular">Body Regular Text</Typography>
      <Typography variant="bodySmall">Body Small Text</Typography>
    </Stack>
  ),
};
