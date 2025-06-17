import {View} from 'react-native';
import {Meta, StoryObj} from '@storybook/react';
import {Box} from '../../layout/Box';
import {Typography} from '../../foundation/Typography';
import {Icon} from './Icon';
import {ICON_MAP, IconName} from './types';
import {theme} from '../../../theme';
import {ThemeProvider} from '@shopify/restyle';

const meta: Meta<typeof Icon> = {
  title: 'Components/Layout/Icon',
  component: Icon,
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'home-alt',
    size: 24,
    color: 'colorTextPrimary',
  },
};

export const AllIcons: Story = {
  render: () => (
    <View
      style={{flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 16}}>
      {Object.keys(ICON_MAP).map(iconName => (
        <Box
          key={iconName}
          width={Number(128)}
          backgroundColor="colorBackgroundSecondary"
          borderRadius={theme.border.radius.md}
          padding="md"
          alignItems="center">
          <Icon
            name={iconName as IconName}
            size={24}
            color="colorTextPrimary"
          />
          <Box marginTop="sm">
            <Typography variant="bodySmall" style={{textAlign: 'center'}}>
              {iconName}
            </Typography>
          </Box>
        </Box>
      ))}
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
      }}>
      <Box alignItems="center">
        <Icon name="star" size={16} color="colorTextPrimary" />
        <Typography variant="bodySmall">16px</Typography>
      </Box>
      <Box alignItems="center">
        <Icon name="star" size={24} color="colorTextPrimary" />
        <Typography variant="bodySmall">24px</Typography>
      </Box>
      <Box alignItems="center">
        <Icon name="star" size={32} color="colorTextPrimary" />
        <Typography variant="bodySmall">32px</Typography>
      </Box>
      <Box alignItems="center">
        <Icon name="star" size={48} color="colorTextPrimary" />
        <Typography variant="bodySmall">48px</Typography>
      </Box>
    </View>
  ),
};

export const Colors: Story = {
  render: () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
      }}>
      <Box alignItems="center">
        <Icon name="star" size={24} color="colorTextPrimary" />
        <Typography variant="bodySmall">Primary</Typography>
      </Box>
      <Box alignItems="center">
        <Icon name="star" size={24} color="colorBrandPrimary" />
        <Typography variant="bodySmall">Brand Primary</Typography>
      </Box>
      <Box alignItems="center">
        <Icon name="star" size={24} color="colorBrandSecondary" />
        <Typography variant="bodySmall">Brand Secondary</Typography>
      </Box>
      <Box alignItems="center">
        <Icon name="star" size={24} color="colorGrey500" />
        <Typography variant="bodySmall">Grey</Typography>
      </Box>
    </View>
  ),
};
