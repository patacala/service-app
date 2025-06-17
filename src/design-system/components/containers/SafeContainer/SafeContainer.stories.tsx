import type {Meta, StoryObj} from '@storybook/react';
import {SafeContainer} from './SafeContainer';
import {Typography} from '../../foundation/Typography';
import {Stack} from '../../layout/Stack';
import {Box} from '../../layout/Box';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';
import {Button} from '../../forms/Button/Button';

const meta: Meta<typeof SafeContainer> = {
  title: 'Components/Containers/SafeContainer',
  component: SafeContainer,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SafeContainer>;

export const Default: Story = {
  args: {
    children: (
      <Stack spacing="lg">
        <Typography variant="headingPrimary" colorVariant="primary">
          Default SafeContainer
        </Typography>
        <Box
          backgroundColor="colorBackgroundSecondary"
          padding="md"
          borderRadius={theme.border.radius.md}>
          <Typography variant="bodyRegular">Content Example</Typography>
        </Box>
      </Stack>
    ),
  },
};

export const WithBackground: Story = {
  args: {
    backgroundImage: require('@/assets/images/brand-background.jpg'),
    backgroundOpacity: 0.5,
    children: (
      <Box flex={1} justifyContent="space-between">
        <Box flex={1} justifyContent="center">
          <Typography
            variant="headingPrimary"
            color="white"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: {width: -1, height: 1},
              textShadowRadius: 10,
            }}>
            SafeContainer with Background
          </Typography>
        </Box>
        <Box gap="md">
          <Button
            variant="secondary"
            label="Primary Action"
            onPress={() => {}}
          />
          <Button
            variant="outlined"
            label="Secondary Action"
            onPress={() => {}}
          />
        </Box>
      </Box>
    ),
  },
};

export const WithCustomOpacity: Story = {
  args: {
    backgroundImage: require('@/assets/images/brand-background.jpg'),
    backgroundOpacity: 0.8,
    children: (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Typography
          variant="headingPrimary"
          color="white"
          style={{
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10,
            textAlign: 'center',
          }}>
          Background with{'\n'}Higher Opacity
        </Typography>
      </Box>
    ),
  },
};

export const CustomEdges: Story = {
  args: {
    edges: ['top', 'bottom'],
    children: (
      <Stack spacing="lg">
        <Typography variant="headingPrimary" colorVariant="primary">
          Safe Area only top and bottom
        </Typography>
        <Box
          backgroundColor="colorBackgroundSecondary"
          padding="md"
          borderRadius={theme.border.radius.md}>
          <Typography variant="bodyRegular">Content</Typography>
        </Box>
      </Stack>
    ),
  },
};

export const WithBackgroundAndCustomEdges: Story = {
  args: {
    backgroundImage: require('@/assets/images/brand-background.jpg'),
    backgroundOpacity: 0.5,
    edges: ['bottom'],
    children: (
      <Box flex={1} justifyContent="space-between">
        <Box flex={1} justifyContent="center">
          <Typography
            variant="headingPrimary"
            color="white"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: {width: -1, height: 1},
              textShadowRadius: 10,
            }}>
            Background with{'\n'}Custom Edges
          </Typography>
        </Box>
        <Button variant="secondary" label="Action Button" onPress={() => {}} />
      </Box>
    ),
  },
};
