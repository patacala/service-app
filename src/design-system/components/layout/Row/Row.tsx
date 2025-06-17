import React from 'react';
import {createBox} from '@shopify/restyle';
import {Theme} from '../../../theme';

const BoxRow = createBox<Theme>();

export type RowProps = React.ComponentProps<typeof BoxRow> & {
  spacing?: keyof Theme['spacing'];
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  wrap?: boolean;
};

export const Row: React.FC<RowProps> = ({
  children,
  spacing = 'md',
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  ...props
}) => (
  <BoxRow
    flexDirection="row"
    alignItems={align}
    justifyContent={justify}
    flexWrap={wrap ? 'wrap' : 'nowrap'}
    gap={spacing}
    {...props}>
    {children}
  </BoxRow>
);
