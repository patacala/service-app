import React from 'react';
import {TouchableOpacity} from 'react-native';
import {createBox, useTheme} from '@shopify/restyle';
import {Theme, theme} from '../../../theme';
import type {ChipProps} from './types';
import {getChipStyles} from './Chip.styles';
import {Typography} from '../../foundation/Typography';

const Box = createBox<Theme>();

interface ChipTextProps {
  selected?: boolean;
  children: React.ReactNode;
}

const ChipText: React.FC<ChipTextProps> = ({selected, children}) => {
  if (React.isValidElement(children) && children.type === Typography) {
    return React.cloneElement(children, {
      ...children.props,
      color: selected ? theme.colors.colorBaseBlack : theme.colors.colorBaseWhite,
    } as React.ComponentProps<typeof Typography>);
  }
  return children;
};

export const Chip: React.FC<ChipProps> = ({
  selected = false,
  onPress,
  variant = 'md',
  fluid = false,
  children,
  ...props
}) => {
  const theme = useTheme<Theme>();
  const styles = getChipStyles(theme, {
    variant,
    selected,
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{alignSelf: fluid ? 'flex-start' : 'stretch'}}>
      <Box style={[styles.container]} {...props}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === Typography) {
            return <ChipText selected={selected}>{child}</ChipText>;
          }
          return child;
        })}
      </Box>
    </TouchableOpacity>
  );
};
