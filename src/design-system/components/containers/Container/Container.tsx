import React from 'react';
import {createBox} from '@shopify/restyle';
import {Theme} from '../../../theme';

const Box = createBox<Theme>();

export type ContainerProps = React.ComponentProps<typeof Box> & {
  fluid?: boolean;
};

export const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  ...props
}) => (
  <Box
    flex={1}
    backgroundColor="colorBackgroundPrimary"
    padding={fluid ? 'none' : 'md'}
    {...props}>
    {children}
  </Box>
);
