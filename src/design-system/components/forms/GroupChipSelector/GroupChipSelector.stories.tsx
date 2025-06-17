import type { Meta, StoryObj } from '@storybook/react';
import { GroupChipSelector } from './GroupChipSelector';
import { useState } from 'react';
import { IconName } from '../../layout/Icon';

const meta: Meta<typeof GroupChipSelector> = {
  title: 'Components/Forms/GroupChipSelector',
  component: GroupChipSelector,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof GroupChipSelector>;

// Opciones comunes para todas las stories
const chipOptions = [
  { id: 'housekeeping', label: 'Housekeeping' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'tutor', label: 'Tutor' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'fitness_trainer', label: 'Fitness Trainer' },
  { id: 'gardening', label: 'Gardening' },
  { id: 'construction', label: 'Construction' },
  { id: 'painter', label: 'Painter' },
  { id: 'others', label: 'Others' },
];

// Opciones con iconos para la historia con iconos
const chipOptionsWithIcons = [
  { id: 'housekeeping', label: 'Housekeeping', icon: 'star' as IconName },
  { id: 'plumbing', label: 'Plumbing', icon: 'star' as IconName },
  { id: 'tutor', label: 'Tutor', icon: 'star' as IconName },
  { id: 'coaching', label: 'Coaching', icon: 'star' as IconName },
  { id: 'fitness_trainer', label: 'Fitness', icon: 'star' as IconName },
  { id: 'gardening', label: 'Gardening', icon: 'star' as IconName },
  { id: 'construction', label: 'Construction', icon: 'star' as IconName },
  { id: 'painter', label: 'Painter', icon: 'star' as IconName },
  { id: 'others', label: 'Others', icon: 'star' as IconName },
];

export const Default: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState(args.selectedIds || []);
    return (
      <GroupChipSelector
        {...args}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
  args: {
    options: chipOptions,
    multiSelect: true,
    selectedIds: [], // Valor inicial
    onChange: () => {}, // Placeholder
  },
};

export const SingleSelect: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState(args.selectedIds || []);
    return (
      <GroupChipSelector
        {...args}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
  args: {
    ...Default.args,
    multiSelect: false,
  },
};

export const WithPreselection: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState(args.selectedIds || []);
    return (
      <GroupChipSelector
        {...args}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
  args: {
    ...Default.args,
    selectedIds: ['housekeeping', 'plumbing'],
  },
};

// Variante vertical con iconos
export const VerticalWithIcons: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState(args.selectedIds || []);
    return (
      <GroupChipSelector
        {...args}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
  args: {
    options: chipOptionsWithIcons,
    multiSelect: true,
    variant: 'vertical',
    selectedIds: [],
  },
};

export const HorizontalScrollSingleSelect: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState(args.selectedIds || []);
    return (
      <GroupChipSelector
        {...args}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
  args: {
    ...Default.args,
    multiSelect: false,
    variant: 'horizontal',
  },
};

export const HorizontalScroll: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState(args.selectedIds || []);
    return (
      <GroupChipSelector
        {...args}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
  args: {
    ...Default.args,
    variant: 'horizontal',
  },
};

export const HorizontalWithPreselection: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState(args.selectedIds || []);
    return (
      <GroupChipSelector
        {...args}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
  args: {
    ...WithPreselection.args,
    variant: 'horizontal',
  },
};

// Nueva historia con iconos - Variante horizontal
export const HorizontalWithIcons: Story = {
  render: function Render(args) {
    const [selectedIds, setSelectedIds] = useState(args.selectedIds || []);
    return (
      <GroupChipSelector
        {...args}
        selectedIds={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
  args: {
    options: chipOptionsWithIcons,
    multiSelect: true,
    variant: 'horizontal',
    selectedIds: ['housekeeping'],
  },
};