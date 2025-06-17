import React from 'react';
import {ImageBackground, ImageSourcePropType} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createBox} from '@shopify/restyle';
import {Theme} from '../../../theme';
import {useTheme} from '@shopify/restyle';

const Box = createBox<Theme>();

export type SafeContainerProps = React.ComponentProps<typeof Box> & {
  fluid?: boolean;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  backgroundImage?: ImageSourcePropType;
  backgroundOpacity?: number;
};

export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  fluid = false,
  edges = ['top', 'right', 'bottom', 'left'],
  backgroundImage,
  backgroundOpacity = 0.5,
  ...props
}) => {
  const theme = useTheme<Theme>();

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover">
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})`,
          }}
          edges={edges}>
          <Box
            flex={1}
            style={{
              padding: fluid ? 0 : theme.spacing.lg,
            }}
            {...props}>
            {children}
          </Box>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.colorBackgroundPrimary,
      }}
      edges={edges}>
      <Box
        flex={1}
        backgroundColor="colorBackgroundPrimary"
        style={{
          padding: fluid ? 0 : theme.spacing.lg,
        }}
        {...props}>
        {children}
      </Box>
    </SafeAreaView>
  );
};
