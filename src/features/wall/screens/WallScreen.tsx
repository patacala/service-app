import { useEffect, useState } from 'react';
import { FlatList, Image, ImageSourcePropType, ListRenderItem, ActivityIndicator } from 'react-native';
import { Box } from '../../../design-system/components/layout/Box';
import { Typography } from '../../../design-system/components/foundation/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CardPost, setFilters } from '../slices/wall.slice';
/* import { addToFavorites } from '../../favorites/slices/favorites.slice'; */
import { Button, ChipOption, GroupChipSelector, Input, theme } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import images from '@/assets/images/images';
import { Post } from '../components/Post';
import { FilterActionSheet } from '../components/FilterActionSheet';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { getWallStyles } from './wall/wall.style';
import { useGetServicesQuery } from '@/features/services/store';
import { useGetCategoriesQuery } from '@/infrastructure/services/api';
import Toast from 'react-native-toast-message';

interface Location {
  id: string;
  name: string;
}

interface WallScreenProps {
  currentLocation?: Location;
  onLocationChange?: (location: Location) => void;
}

export const WallScreen: React.FC<WallScreenProps> = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
  }>({
    tags: [],
    minPrice: undefined,
    maxPrice: undefined
  });

  /* const currentLocation = useSelector((state: RootState) => state.location.currentLocation); */
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery({ language: 'en' }); 
  const { data, isLoading } = useGetServicesQuery({
    query: searchQuery,
    cat: selectedCategories.includes('all') ? undefined : selectedCategories.join(','),
    tag: '',
    /* city: currentLocation?.name, */
    city: '',
  });

  const categories: ChipOption[] =
  categoriesData?.categories?.map((c: any) => ({
    id: c.id,
    label: c.name,
  })) ?? [];
  const categoryOptionsWithAll = [{ id: 'all', label: 'All' }, ...(categories || []).filter((cat: { id: string; }) => cat.id !== 'all')];
    
  useEffect(() => {
    if (categoriesError) {
      Toast.show({
        type: 'error',
        text1: 'Error al cargar categorías',
        text2: (categoriesError as any)?.message ?? 'No se pudieron cargar las categorías.',
      });
    }
  }, [categoriesError]);

  const posts = data?.data || [];
  const isLoadingPosts = isLoading || isCategoriesLoading;

  const getCategoryNames = (categoryIds: string[]) => {
    if (!categoryIds || categoryIds.length === 0 || !categories) return 'Sin categoría';
    
    return categoryIds
      .map(id => {
        const category = categories.find((cat: any) => cat.id === id);
        return category ? category.label : `Category ${id}`;
      })
      .join(', ');
  };

  const handleCategoryChange = (selectedIds: string[]) => {
    let newSelectedIds = [...selectedIds];

    if (newSelectedIds.length === 0) {
      newSelectedIds = ['all'];
    } else if (selectedIds.includes('all') && !selectedCategories.includes('all')) {
      newSelectedIds = ['all'];
    } else if (selectedIds.includes('all') && selectedIds.length > 1) {
      newSelectedIds = selectedIds.filter(id => id !== 'all');
    }

    setSelectedCategories(newSelectedIds);
    const tagsToSend = newSelectedIds.includes('all') ? [] : newSelectedIds;
    setActiveFilters(prev => ({ ...prev, tags: tagsToSend }));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setFilterVisible(false);
    
    if (filters.tags && filters.tags.length > 0) {
      setSelectedCategories(filters.tags);
    } else {
      setSelectedCategories(['all']);
    }
  };

  const handlePostDetail = (item: CardPost) => {
    navigation.navigate('ServiceDetail', {
      post: item
    });
  };

  const renderItem: ListRenderItem<CardPost> = ({ item }) => (
    <Post
      post={{
        ...item,
        category: getCategoryNames(item.categories)
      }}
      isFavorite={favorites.some((fav: { id: string; }) => fav.id === item.id)}
      onPress={() => handlePostDetail(item)}
    />
  );

  return (
    <>
      <Box marginTop="lg">
        <Row justifyContent="space-between" alignItems="center">
          <Box style={{ flex: 1 }}>
            <Input
              placeholder="Search from 100+ services"
              variant="search"
              style={getWallStyles.inputSearch}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </Box>
          <Button
            label=""
            centerIcon={images.filterIcon as ImageSourcePropType}
            onPress={() => setFilterVisible(true)}
            variant="centerIconOnly"
            size="medium"
            style={getWallStyles.filterButton}
          />
        </Row>
      </Box>

      <Box marginTop="sm">
        <GroupChipSelector
          onChange={handleCategoryChange}
          options={categoryOptionsWithAll}
          selectedIds={selectedCategories}
          variant="horizontal"
          multiSelect={true}
        />
      </Box>

      {isLoadingPosts ? (
        <Box style={getWallStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.colorBrandPrimary} />
          <Typography variant="bodyMedium" color="white" style={getWallStyles.loadingText}>
            Loading services...
          </Typography>
        </Box>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item: CardPost) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            getWallStyles.listContainer,
            { height: posts.length > 0 ? "auto" : "100%" }
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Box style={getWallStyles.withoutResult} justifyContent="center" alignItems="center">
              <Image
                source={images.withoutResult as ImageSourcePropType}
                resizeMode="contain"
              />
              <Box marginTop="lg">
                <Typography style={getWallStyles.textWithoutResult}
                  variant="bodyMedium"
                  color={theme.colors.colorBaseWhite}>
                  Looks like we're all out of results.
                  Want to try again, or are we officially lost?
                </Typography>
              </Box>
            </Box>
          }
        />
      )}
      <FilterActionSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilters}
        initialValues={activeFilters}
        selectedCategories={selectedCategories}
      />
    </>
  );
};