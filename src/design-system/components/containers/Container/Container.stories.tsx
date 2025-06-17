import type {Meta, StoryObj} from '@storybook/react';
import {Container} from './Container';
import {Typography} from '../../foundation/Typography';
import {Box} from '../../layout/Box/Box';
import {Stack} from '../../layout/Stack/Stack';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';

const meta: Meta<typeof Container> = {
  title: 'Components/Containers/Container',
  component: Container,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <Stack spacing="lg">
        <Typography variant="headingPrimary" colorVariant="primary">
          Container Example
        </Typography>
        <Box
          backgroundColor="colorBackgroundSecondary"
          padding="md"
          borderRadius={theme.border.radius.md}>
          <Typography variant="bodyRegular">
            Content inside container
          </Typography>
        </Box>
      </Stack>
    ),
  },
};

export const FluidContainer: Story = {
  args: {
    fluid: true,
    children: (
      <Box backgroundColor="colorBackgroundSecondary" padding="md">
        <Typography variant="bodyRegular">
          Fluid container without padding
        </Typography>
      </Box>
    ),
  },
};
