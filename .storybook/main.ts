import type { StorybookConfig } from '@storybook/react-native';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-react-native-web',
    '@storybook/addon-viewport',
  ],
};

export default config;