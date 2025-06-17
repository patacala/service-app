import React from 'react';
import {ThemeProvider as RestyleThemeProvider} from '@shopify/restyle';
import {theme} from './theme';

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => <RestyleThemeProvider theme={theme}>{children}</RestyleThemeProvider>;
