import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions
} from 'react-native';
import { Box } from '@/design-system/components/layout/Box';
import { Typography } from '@/design-system/components/foundation/Typography';
import { Button, theme, GroupChipSelector, BottomModal } from '@/design-system';
import { Icon } from '@/design-system/components/layout/Icon';
import { Row } from '@/design-system/components/layout/Row/Row';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useGetCategoriesQuery } from '@/infrastructure/services/api';

interface FilterValues {
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
}

interface FilterActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialValues?: FilterValues;
  selectedCategories?: string[];
}

const CustomMarker = () => (
  <View style={styles.customMarker}>
    <View style={styles.markerInner} />
  </View>
);

export const FilterActionSheet: React.FC<FilterActionSheetProps> = ({
  visible,
  onClose,
  onApply,
  initialValues = { tags: [], minPrice: 10, maxPrice: 62 },
  selectedCategories = ['all']
}) => {
  // 🔥 Traemos las categorías con RTK Query
  const { data: categoriesData, isLoading } = useGetCategoriesQuery({ language: 'en' });

  // Por ahora simulamos "pinnedServices" (si luego quieres podemos añadirlo a RTK)
  const pinnedServices = categoriesData?.categories?.slice(0, 6).map((c: any) => ({
    id: c.id,
    label: c.name,
  })) || [];

  const allServices = categoriesData?.categories?.map((c: any) => ({
    id: c.id,
    label: c.name,
  })) || [];
  
  const [selectedTags, setSelectedTags] = useState<string[]>(initialValues.tags || []);
  const [priceValues, setPriceValues] = useState<number[]>([
    initialValues.minPrice || 10, 
    initialValues.maxPrice || 62
  ]);

  // Efecto para sincronizar cuando se abre el modal
  useEffect(() => {
    if (visible) {
      if (!selectedCategories.includes('all') && initialValues.tags && initialValues.tags.length === 0) {
        setSelectedTags([...selectedCategories]);
      } else {
        setSelectedTags(initialValues.tags || []);
      }
      
      setPriceValues([
        initialValues.minPrice || 10,
        initialValues.maxPrice || 62
      ]);
    }
  }, [visible, initialValues, selectedCategories]);

  const handleSelectTags = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleValueChange = (values: number[]) => {
    setPriceValues([Math.round(values[0]), Math.round(values[1])]);
  };

  const handleApplyFilters = () => {
    const filtersToApply = {
      tags: selectedTags,
      minPrice: priceValues[0],
      maxPrice: priceValues[1]
    };
    
    onApply(filtersToApply);
    onClose();
  };

  useEffect(() => {
    if (!visible) {
      setSelectedTags(initialValues.tags || []);
      setPriceValues([
        initialValues.minPrice || 10,
        initialValues.maxPrice || 62
      ]);
    }
  }, [visible]);

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title="Filters"
      draggable={true}
      height={'90%'}
    >
      <Box>
        {/* Service Tags Section */}
        <Box>
          <Row justifyContent="space-between" marginBottom="md">
            <Row>
              <Icon name="tag" size={20} color="colorBaseWhite" />
              <Box>
                <Typography variant="bodyLarge" color={theme.colors.colorBaseWhite}>
                  Service Tags
                </Typography>
              </Box>
            </Row>
          </Row>
          
          {/* Pinned Services */}
          <Box marginBottom="md">
            <Row justifyContent="space-between" alignItems="center" marginBottom="xs">
              <Typography variant="bodyMedium" color={theme.colors.colorGrey200}>
                Pinned Services
              </Typography>
              <Typography variant="bodyMedium" color={theme.colors.colorGrey200}>
                {pinnedServices.length}/6
              </Typography>
            </Row>
            
            {isLoading ? (
              <Typography variant="bodySmall" color={theme.colors.colorGrey200}>
                Loading...
              </Typography>
            ) : (
              <GroupChipSelector
                options={pinnedServices}
                selectedIds={selectedTags}
                onChange={handleSelectTags}
                multiSelect={true}
                variant="vertical"
              />
            )}
          </Box>
          
          {/* All Services */}
          <Box gap="xs">
            <Box gap="xs">
              <Typography variant="bodyMedium" color={theme.colors.colorGrey200}>
                All Services
              </Typography>
              <Typography variant="bodyRegular" color={theme.colors.colorGrey200}>
                Hold over the tap in order to switch your pinned services
              </Typography>
            </Box>
            
            {isLoading ? (
              <Typography variant="bodySmall" color={theme.colors.colorGrey200}>
                Loading...
              </Typography>
            ) : (
              <GroupChipSelector
                options={allServices}
                selectedIds={selectedTags}
                onChange={handleSelectTags}
                multiSelect={true}
                variant="vertical"
              />
            )}
          </Box>
        </Box>
        
        {/* Price Range Section */}
        <Box marginTop="lg" marginBottom="md" paddingTop="lg" borderTopWidth={2} borderColor="colorGrey600">
          <Row alignItems="center" marginBottom="md">
            <Icon name="dollar" size={20} color="colorBaseWhite" />
            <Box marginLeft="xs">
              <Typography variant="bodyLarge" color="white">
                Price Range
              </Typography>
            </Box>
          </Row>
          
          <Row justifyContent="space-between" marginBottom="sm">
            <Typography variant="bodyMedium" color="white">
              ${priceValues[0]}
            </Typography>
            <Typography variant="bodyMedium" color="white">
              ${priceValues[1]}
            </Typography>
          </Row>
          
          <Box width="100%" alignItems="center" marginVertical="sm">
            <MultiSlider
              values={priceValues}
              sliderLength={width - 40}
              min={0}
              max={100}
              step={1}
              allowOverlap={false}
              snapped
              onValuesChange={handleValueChange}
              selectedStyle={{
                backgroundColor: theme.colors.colorBaseWhite,
              }}
              unselectedStyle={{
                backgroundColor: theme.colors.colorGrey200,
              }}
              containerStyle={{
                height: 40,
              }}
              trackStyle={{
                height: 6,
                borderRadius: 2,
              }}
              markerStyle={styles.marker}
              customMarker={CustomMarker}
            />
          </Box>
        </Box>
        
        <Box>
          <Button
            label="Apply Filters"
            variant="primary"
            onPress={handleApplyFilters}
          />
        </Box>
      </Box>
    </BottomModal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  marker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.colorBaseWhite,
    borderWidth: 2,
    borderColor: theme.colors.colorBaseWhite,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.colorBaseWhite,
    borderWidth: 1,
    borderColor: theme.colors.colorBaseWhite,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.colorBaseBlack,
  }
});
