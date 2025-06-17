import {Theme} from '../../../theme';
import {ViewStyle} from 'react-native';

export const VARIANTS = {
  container: (theme: Theme): ViewStyle => ({
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: 'transparent',
  }),

  card: (theme: Theme): ViewStyle => ({
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.colorBackgroundPrimary,
    borderRadius: theme.border.radius.pill,
    borderColor: 'white',
    borderWidth: 1,
  }),

  form: (theme: Theme): ViewStyle => ({
    gap: theme.spacing.md,
  }),

  header: (theme: Theme): ViewStyle => ({
    marginBottom: theme.spacing.xl,
  }),

  footer: (theme: Theme): ViewStyle => ({
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  }),

  body: (theme: Theme): ViewStyle => ({
    flex: 1,
    gap: theme.spacing.md,
  }),

  background: (theme: Theme): ViewStyle => ({
    flex: 1,
    backgroundColor: theme.colors.colorBackgroundPrimary,
  }),

  clean: (): ViewStyle => ({
    backgroundColor: 'inherit',
  }),
} as const;

export type BoxVariant = keyof typeof VARIANTS;

export const getBoxStyles = (theme: Theme, variant: BoxVariant = 'clean') => {
  const styles = VARIANTS[variant](theme);
  return styles;
};
