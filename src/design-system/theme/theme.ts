import {createTheme} from '@shopify/restyle';
import {tokens} from '../tokens/generated/tokens';

export const theme = createTheme({
  colors: {
    colorBaseBlack: tokens.colors.base.black.value,
    colorBaseWhite: tokens.colors.base.white.value,
    colorGrey100: tokens.colors.grey['100'].value,
    colorGrey200: tokens.colors.grey['200'].value,
    colorGrey300: tokens.colors.grey['300'].value,
    colorGrey400: tokens.colors.grey['400'].value,
    colorGrey500: tokens.colors.grey['500'].value,
    colorGrey600: tokens.colors.grey['600'].value,
    colorBrandPrimary: tokens.colors.brand.primary.value,
    colorBrandSecondary: tokens.colors.brand.secondary.value,
    colorTextPrimary: tokens.colors.text.primary.value,
    colorTextSecondary: tokens.colors.text.secondary.value,
    colorBackgroundPrimary: tokens.colors.background.primary.value,
    colorBackgroundSecondary: tokens.colors.background.secondary.value,
    colorFeedbackError: tokens.colors.feedback.error.value,
    colorFeedbackSuccess: tokens.colors.feedback.success.value,
    colorFeedbackWarning: tokens.colors.feedback.warning.value,
    colorFeedbackInfo: tokens.colors.feedback.info.value,
  },
  spacing: {
    none: 0,
    xxs: tokens.spacing.xxs.value,
    xs: tokens.spacing.xs.value,
    sm: tokens.spacing.sm.value,
    md: tokens.spacing.md.value,
    lg: tokens.spacing.lg.value,
    xl: tokens.spacing.xl.value,
  },
  border: {
    radius: {
      sm: tokens.border.radius.sm.value,
      md: tokens.border.radius.md.value,
      lg: tokens.border.radius.lg.value,
      pill: tokens.border.radius.pill.value,
      full: tokens.border.radius.full.value,
    },
    solid: {
      1: tokens.border.solid['1'].value,
      2: tokens.border.solid['2'].value,
      3: tokens.border.solid['3'].value,
      4: tokens.border.solid['4'].value,
      5: tokens.border.solid['5'].value,
    },
  },
  text: {
    weight: {
      regular: tokens.typography.weight.regular.value,
      medium: tokens.typography.weight.medium.value,
      semiBold: tokens.typography.weight.semiBold.value,
      bold: tokens.typography.weight.bold.value,
    },
    heading: {
      primary: {
        fontFamily: tokens.typography.heading.primary.fontFamily.value,
        fontSize: tokens.typography.heading.primary.fontSize.value,
        lineHeight: tokens.typography.heading.primary.lineHeight.value,
        fontWeight: tokens.typography.heading.primary.fontWeight.value,
      },
      secondary: {
        fontFamily: tokens.typography.heading.secondary.fontFamily.value,
        fontSize: tokens.typography.heading.secondary.fontSize.value,
        lineHeight: tokens.typography.heading.secondary.lineHeight.value,
        fontWeight: tokens.typography.heading.secondary.fontWeight.value,
      },
    },
    body: {
      regular: {
        fontFamily: tokens.typography.body.regular.fontFamily.value,
        fontSize: tokens.typography.body.regular.fontSize.value,
        lineHeight: tokens.typography.body.regular.lineHeight.value,
        fontWeight: tokens.typography.body.regular.fontWeight.value,
      },
      medium: {
        fontFamily: tokens.typography.body.medium.fontFamily.value,
        fontSize: tokens.typography.body.medium.fontSize.value,
        lineHeight: tokens.typography.body.medium.lineHeight.value,
        fontWeight: tokens.typography.body.medium.fontWeight.value,
      },
      large: {
        fontFamily: tokens.typography.body.large.fontFamily.value,
        fontSize: tokens.typography.body.large.fontSize.value,
        lineHeight: tokens.typography.body.large.lineHeight.value,
        fontWeight: tokens.typography.body.large.fontWeight.value,
      },
      small: {
        fontFamily: tokens.typography.body.small.fontFamily.value,
        fontSize: tokens.typography.body.small.fontSize.value,
        lineHeight: tokens.typography.body.small.lineHeight.value,
        fontWeight: tokens.typography.body.small.fontWeight.value,
      },
      xsmall: {
        fontFamily: tokens.typography.body.xsmall.fontFamily.value,
        fontSize: tokens.typography.body.xsmall.fontSize.value,
        lineHeight: tokens.typography.body.small.lineHeight.value,
        fontWeight: tokens.typography.body.small.fontWeight.value,
      },
    },
    button: {
      fontFamily: tokens.typography.button.fontFamily.value,
      fontSize: tokens.typography.button.fontSize.value,
      lineHeight: tokens.typography.button.lineHeight.value,
      fontWeight: tokens.typography.button.fontWeight.value,
    },
  },
});

export type Theme = typeof theme;

// Light theme como variante
export const lightTheme = createTheme({
  ...theme,
  colors: {
    ...theme.colors,
    colorBackgroundPrimary: tokens.colors.background.primary.value,
    colorBackgroundSecondary: tokens.colors.background.secondary.value,
    colorTextPrimary: tokens.colors.text.primary.value,
    colorTextSecondary: tokens.colors.text.secondary.value,
  },
});