import type {Meta, StoryObj} from '@storybook/react';
import {Chip} from './Chip';
import {ThemeProvider} from '@shopify/restyle';
import {theme} from '../../../theme';
import {Stack} from '../../layout/Stack';
import {Typography} from '../../foundation/Typography';

const meta: Meta<typeof Chip> = {
  title: 'Components/Forms/Chip',
  component: Chip,
  args: {
    selected: false,
    fluid: false,
    variant: 'md',
    children: <Typography variant="bodyRegular">Chip Text</Typography>,
  },
  argTypes: {
    selected: {
      control: 'boolean',
      description: 'Whether the chip is selected',
    },
    fluid: {
      control: 'boolean',
      description: 'Whether the chip should take full width',
    },
    variant: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the chip',
    },
    backgroundColor: {table: {disable: true}},
    margin: {table: {disable: true}},
    marginBottom: {table: {disable: true}},
    marginLeft: {table: {disable: true}},
    marginRight: {table: {disable: true}},
    marginTop: {table: {disable: true}},
    padding: {table: {disable: true}},
    paddingBottom: {table: {disable: true}},
    paddingLeft: {table: {disable: true}},
    paddingRight: {table: {disable: true}},
    paddingTop: {table: {disable: true}},
    borderRadius: {table: {disable: true}},
    height: {table: {disable: true}},
    width: {table: {disable: true}},
    minWidth: {table: {disable: true}},
    maxWidth: {table: {disable: true}},
    minHeight: {table: {disable: true}},
    maxHeight: {table: {disable: true}},
  },
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: <Typography variant="bodyRegular">Default Chip</Typography>,
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    children: <Typography variant="bodyRegular">Selected Chip</Typography>,
  },
};

export const Variants: Story = {
  render: args => (
    <Stack spacing="md">
      <Chip {...args} variant="sm">
        <Typography variant="bodySmall">Small Chip</Typography>
      </Chip>
      <Chip {...args} variant="md">
        <Typography variant="bodyRegular">Medium Chip</Typography>
      </Chip>
      <Chip {...args} variant="lg">
        <Typography variant="bodyRegular">Large Chip</Typography>
      </Chip>
    </Stack>
  ),
};

export const ChipGroup: Story = {
  render: args => (
    <Stack spacing="md">
      <Stack direction="horizontal" spacing="sm" wrap>
        <Chip {...args} selected variant="sm">
          <Typography variant="bodySmall">Selected</Typography>
        </Chip>
        <Chip {...args} variant="sm">
          <Typography variant="bodySmall">Default</Typography>
        </Chip>
        <Chip {...args} variant="sm">
          <Typography variant="bodySmall">Default</Typography>
        </Chip>
      </Stack>
    </Stack>
  ),
};
