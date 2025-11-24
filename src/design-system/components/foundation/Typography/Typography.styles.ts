import {StyleSheet} from 'react-native';
import {theme, Theme} from '../../../theme';
import {TypographyVariant} from './types';

const TYPOGRAPHY_VARIANTS = {
  button: (theme: Theme) => ({
    fontFamily: theme.text.button.fontFamily,
    fontSize: theme.text.button.fontSize,
    fontWeight: theme.text.button.fontWeight,
  }),
  headingPrimary: (theme: Theme) => ({
    fontFamily: theme.text.heading.primary.fontFamily,
    fontSize: theme.text.heading.primary.fontSize,
    lineHeight: theme.text.heading.primary.lineHeight,
    fontWeight: theme.text.heading.primary.fontWeight,
  }),
  headingSecondary: (theme: Theme) => ({
    fontFamily: theme.text.heading.secondary.fontFamily,
    fontSize: theme.text.heading.secondary.fontSize,
    lineHeight: theme.text.heading.secondary.lineHeight,
    fontWeight: theme.text.heading.secondary.fontWeight,
  }),
  bodyLarge: (theme: Theme) => ({
    fontFamily: theme.text.body.large.fontFamily,
    fontSize: theme.text.body.large.fontSize,
    lineHeight: theme.text.body.large.lineHeight,
    fontWeight: theme.text.body.large.fontWeight,
  }),
  bodyMedium: (theme: Theme) => ({
    fontFamily: theme.text.body.medium.fontFamily,
    fontSize: theme.text.body.medium.fontSize,
    lineHeight: theme.text.body.medium.lineHeight,
    fontWeight: theme.text.body.medium.fontWeight,
  }),
  bodyRegular: (theme: Theme) => ({
    fontFamily: theme.text.body.regular.fontFamily,
    fontSize: theme.text.body.regular.fontSize,
    lineHeight: theme.text.body.regular.lineHeight,
    fontWeight: theme.text.body.regular.fontWeight,
  }),
  bodySmall: (theme: Theme) => ({
    fontFamily: theme.text.body.small.fontFamily,
    fontSize: theme.text.body.small.fontSize,
    lineHeight: theme.text.body.small.lineHeight,
    fontWeight: theme.text.body.small.fontWeight,
  }),
  bodyXSmall: (theme: Theme) => ({
    fontFamily: theme.text.body.xsmall.fontFamily,
    fontSize: theme.text.body.xsmall.fontSize
  }),
  bodyBold: (theme: Theme) => ({
    fontFamily: theme.text.body.xsmall.fontFamily,
    fontSize: theme.text.body.small.fontSize,
    fontWeight: theme.text.heading.primary.fontWeight,
  }),
  bodyBold16: (theme: Theme) => ({
    fontFamily: theme.text.body.xsmall.fontFamily,
    fontSize: theme.text.body.regular.fontSize,
    fontWeight: theme.text.heading.primary.fontWeight,
  }),
};

const COLOR_VARIANTS = {
  primary: (theme: Theme) => ({
    color: theme.colors.colorTextPrimary,
  }),
  secondary: (theme: Theme) => ({
    color: theme.colors.colorTextSecondary,
  }),
  colorFeedbackError: (theme: Theme) => ({
    color: theme.colors.colorFeedbackError,
  }),
};

export const getTypographyStyles = (
  theme: Theme,
  {
    variant,
    colorVariant = 'primary',
    color,
  }: {
    variant: TypographyVariant;
    colorVariant?: keyof typeof COLOR_VARIANTS;
    color?: string;
  },
) =>
  StyleSheet.create({
    text: {
      ...TYPOGRAPHY_VARIANTS[variant](theme),
      ...(color ? {color: color} : COLOR_VARIANTS[colorVariant](theme)),
    },
  });
