import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, Typography, Chip, theme } from '@/design-system';
import { ChipSelectorProps } from './types';
import { Icon } from '../../layout/Icon';

export const GroupChipSelector: React.FC<ChipSelectorProps> = ({
  options,
  selectedIds,
  onChange,
  multiSelect = true,
  error,
  variant = 'vertical',
  textVariant = 'bodyRegular',
  noPadding = false,
  noGap = false,
  noScroll = false,
  maxHeight,
}) => {
  const handleChipPress = (id: string) => {
    if (multiSelect) {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter(selectedId => selectedId !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    } else {
      onChange([id]);
    }
  };

  const isHorizontal = variant === 'horizontal';

  return (
    <>
      <ScrollView 
        horizontal={isHorizontal}
        contentContainerStyle={{ 
          paddingBottom: noPadding ? 0 : 12,
          paddingTop: noPadding ? 0 : (error ? 0 : 12),
          ...(isHorizontal ? { flexGrow: 1 } : {})
        }}
        showsVerticalScrollIndicator={!isHorizontal && !noScroll}
        showsHorizontalScrollIndicator={isHorizontal && !noScroll}
        scrollEnabled={!noScroll}
        style={{
          maxHeight: maxHeight || (isHorizontal ? 60 : 140),
          borderWidth: error ? 1 : 0,
          borderColor: error ? theme.colors.colorFeedbackError : 'transparent',
          borderRadius: theme.border.radius.md,
        }}
      >
        <Box 
          flexDirection={isHorizontal ? "row" : "row"} 
          flexWrap={isHorizontal ? "nowrap" : "wrap"} 
          gap={noGap ? "none" : "sm"}
        >
          {options.map(option => {
            const isSelected = selectedIds.includes(option.id);
            
            return (
              <Chip
                key={option.id}
                selected={isSelected}
                onPress={() => handleChipPress(option.id)}
                variant="md"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {option.icon && (
                    <Box marginRight={noGap ? "none" : "sm"}>
                      <Icon name={option.icon} size={20} color={isSelected ? 'colorBaseBlack': 'colorBaseWhite'} />
                    </Box>
                  )}

                  <Typography 
                    variant={textVariant}
                    color={isSelected ? theme.colors.colorBaseBlack: theme.colors.colorGrey100}
                  >
                    {option.label}
                  </Typography>
                </View>
              </Chip>
            );
          })}
        </Box>
      </ScrollView>
      {error && (
        <Typography 
          variant="bodySmall" 
          color={theme.colors.colorFeedbackError}
        >
          {error}
        </Typography>
      )}
    </>
  );
};