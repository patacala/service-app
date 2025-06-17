import React from 'react';
import {createBox} from '@shopify/restyle';
import {Theme} from '../../../theme';

const BoxColumn = createBox<Theme>();

export type ColumnProps = React.ComponentProps<typeof BoxColumn> & {
  spacing?: keyof Theme['spacing'];
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  fullHeight?: boolean;
};

export const Column: React.FC<ColumnProps> = ({
  children,
  spacing = 'md',
  align = 'stretch',
  justify = 'flex-start',
  fullHeight = false,
  ...props
}) => (
  <BoxColumn
    flexDirection="column"
    alignItems={align}
    justifyContent={justify}
    height={fullHeight ? '100%' : undefined}
    gap={spacing}
    {...props}>
    {children}
  </BoxColumn>
);
