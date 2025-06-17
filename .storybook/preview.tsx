import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/design-system/theme/ThemeProvider';
import { theme } from '../src/design-system/theme/theme';
import { View } from 'react-native';

const VIEWPORTS = {
  mobile1: {
    name: 'iPhone SE',
    styles: {
      width: '375px',
      height: '667px',
    },
    type: 'mobile',
  },
  mobile2: {
    name: 'iPhone 12 Pro',
    styles: {
      width: '390px',
      height: '844px',
    },
    type: 'mobile',
  },
  mobile3: {
    name: 'iPhone 12 Pro Max',
    styles: {
      width: '428px',
      height: '926px',
    },
    type: 'mobile',
  },
};

const MobileDecorator = (Story: any) => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#fff',
      maxWidth: 428,
      marginHorizontal: 'auto',
      height: '100%',
    }}
  >
    <Story />
  </View>
);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: VIEWPORTS,
      defaultViewport: 'mobile2',
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
    MobileDecorator,
  ],
};

export default preview; 