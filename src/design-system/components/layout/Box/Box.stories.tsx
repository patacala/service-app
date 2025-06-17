import type {Meta, StoryObj} from '@storybook/react';
import {Box} from './Box';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';
import {View} from 'react-native';
import {Typography} from '../../foundation/Typography';

const meta: Meta<typeof Box> = {
  title: 'Components/Layout/Box',
  component: Box,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <View style={{padding: 20, backgroundColor: '#1E1E1E'}}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: () => (
    <Box>
      <Typography variant="bodyMedium" color="white">
        Default Box (clean variant)
      </Typography>
    </Box>
  ),
};

export const Container: Story = {
  render: () => (
    <Box variant="container">
      <Typography variant="bodyMedium" color="white">
        Container Variant
      </Typography>
    </Box>
  ),
};

export const Card: Story = {
  render: () => (
    <Box variant="card">
      <Typography variant="bodyMedium" color="white">
        Card Variant
      </Typography>
    </Box>
  ),
};

export const Form: Story = {
  render: () => (
    <Box variant="form">
      <Typography variant="bodyMedium" color="white">
        Form Item 1
      </Typography>
      <Typography variant="bodyMedium" color="white">
        Form Item 2
      </Typography>
      <Typography variant="bodyMedium" color="white">
        Form Item 3
      </Typography>
    </Box>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Box variant="container">
      <Box variant="header">
        <Typography variant="headingPrimary" color="white">
          Header Variant
        </Typography>
      </Box>
      <Typography variant="bodyMedium" color="white">
        Content
      </Typography>
    </Box>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Box variant="container">
      <Typography variant="bodyMedium" color="white">
        Content
      </Typography>
      <Box variant="footer">
        <Typography variant="bodyMedium" color="white">
          Footer Item 1
        </Typography>
        <Typography variant="bodyMedium" color="white">
          Footer Item 2
        </Typography>
      </Box>
    </Box>
  ),
};

export const FullLayout: Story = {
  render: () => (
    <Box variant="container">
      <Box variant="header">
        <Typography variant="headingPrimary" color="white">
          Header
        </Typography>
      </Box>
      <Box variant="body">
        <Box variant="card">
          <Typography variant="bodyMedium" color="white">
            Card Content
          </Typography>
        </Box>
        <Box variant="form">
          <Typography variant="bodyMedium" color="white">
            Form Item 1
          </Typography>
          <Typography variant="bodyMedium" color="white">
            Form Item 2
          </Typography>
        </Box>
      </Box>
      <Box variant="footer">
        <Typography variant="bodyMedium" color="white">
          Footer Content
        </Typography>
      </Box>
    </Box>
  ),
};

export const WithCustomStyle: Story = {
  render: () => (
    <Box
      variant="card"
      style={{
        backgroundColor: theme.colors.colorBrandPrimary,
        padding: theme.spacing.xl,
        borderRadius: theme.border.radius.lg,
      }}>
      <Typography variant="bodyMedium" color="white">
        Card with Custom Style
      </Typography>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box variant="container">
      <Box variant="body" style={{gap: theme.spacing.xl}}>
        <Box variant="card">
          <Typography variant="bodyMedium" color="white">
            Card 1
          </Typography>
        </Box>
        <Box
          variant="card"
          style={{backgroundColor: theme.colors.colorBrandPrimary}}>
          <Typography variant="bodyMedium" color="white">
            Card 2 (Custom Background)
          </Typography>
        </Box>
        <Box variant="card" style={{padding: theme.spacing.xl}}>
          <Typography variant="bodyMedium" color="white">
            Card 3 (Extra Padding)
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
};
