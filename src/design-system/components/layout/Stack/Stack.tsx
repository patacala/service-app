import React from 'react';
import {createBox} from '@shopify/restyle';
import {Theme} from '../../../theme';

const BoxStack = createBox<Theme>();

export type StackProps = React.ComponentProps<typeof BoxStack> & {
  spacing?: keyof Theme['spacing'];
  direction?: 'vertical' | 'horizontal';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  wrap?: boolean;
  fullWidth?: boolean;
};

export const Stack: React.FC<StackProps> = ({
  children,
  spacing = 'md',
  direction = 'vertical',
  align = 'stretch',
  justify = 'flex-start',
  wrap = false,
  fullWidth = false,
  ...props
}) => (
  <BoxStack
    flexDirection={direction === 'vertical' ? 'column' : 'row'}
    alignItems={align}
    justifyContent={justify}
    flexWrap={wrap ? 'wrap' : 'nowrap'}
    width={fullWidth ? '100%' : undefined}
    gap={spacing}
    {...props}>
    {children}
  </BoxStack>
);
