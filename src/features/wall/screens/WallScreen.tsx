import { useEffect, useState } from 'react';
import { FlatList, Image, ImageSourcePropType, ListRenderItem, ActivityIndicator } from 'react-native';
import { Box } from '../../../design-system/components/layout/Box';
import { Typography } from '../../../design-system/components/foundation/Typography';
import { CardPost } from '../slices/wall.slice';
import { Button, ChipOption, GroupChipSelector, Input, theme } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import images from '@/assets/images/images';
import { Post } from '../components/Post';
import { FilterActionSheet } from '../components/FilterActionSheet';
import { getWallStyles } from './wall/wall.style';
import { useGetServicesQuery } from '@/features/services/store';
import { useGetCategoriesQuery } from '@/infrastructure/services/api';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getDeviceLanguage } from '@/assembler/config/i18n';

interface Location {
  id: string;
  name: string;
}

interface WallScreenProps {
  currentLocation?: Location;
  onLocationChange?: (location: Location) => void;
}

export const WallScreen: React.FC<WallScreenProps> = () => {
  const router = useRouter();
  const { t } = useTranslation('auth');
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
  const { data: categoriesData, error: categoriesError } = useGetCategoriesQuery({ language: getDeviceLanguage() }); 
  const { data, isLoading: isLoadingServices, isFetching: isFetchingServices, isError: isErrorServices } = useGetServicesQuery({
    query: searchQuery,
    cat: selectedCategories.includes('all') ? undefined : selectedCategories.join(','),
    minPrice: activeFilters.minPrice,
    maxPrice: activeFilters.maxPrice,
    tag: '',
    /* city: currentLocation?.name, */
    city: '',
  });

  const categories: ChipOption[] =
  categoriesData?.categories?.map((c: any) => ({
    id: c.id,
    label: c.name,
  })) ?? [];

  const selectedWithoutAll = selectedCategories.filter(id => id !== 'all');
  const sortedCategories = [
    { id: 'all', label: 'All' },
    ...categories.filter(cat => selectedWithoutAll.includes(cat.id)),
    ...categories.filter(cat => cat.id !== 'all' && !selectedWithoutAll.includes(cat.id)),
  ];

  const categoryOptionsWithAll = sortedCategories;
    
  useEffect(() => {
    if (categoriesError) {
      Toast.show({
        type: 'error',
        text1: t("message.msg25"),
        text2: t("message.msg26"),
      });
    }
  }, [categoriesError]);

  useEffect(() => {
    if (isErrorServices) {
      Toast.show({
        type: 'error',
        text1: t("message.msg28"),
        text2: t("message.msg29"),
      });
    }
  }, [isErrorServices]);

  const posts = data?.data || [];
  const getCategoryNames = (categoryIds: string[]) => {
    if (!categoryIds || categoryIds.length === 0 || !categories) return t("message.msg27");
    
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
    router.push({
      pathname: '/service-detail',
      params: { 
        post: JSON.stringify(item) 
      }
    });
  };

  const renderItem: ListRenderItem<CardPost> = ({ item }) => (
    <Post
      post={{
        ...item,
        category: getCategoryNames(item.categories)
      }}
      onPress={() => handlePostDetail(item)}
    />
  );

  return (
    <>
      <Box marginTop="lg">
        <Row justifyContent="space-between" alignItems="center">
          <Box style={{ flex: 1 }}>
            <Input
              placeholder={t("messages.msg33")}
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

      {isLoadingServices || isFetchingServices ? (
        <Box style={getWallStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.colorBrandPrimary} />
          <Typography variant="bodyMedium" color="white" style={getWallStyles.loadingText}>
            {t("messages.msg31")}
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
                  {t("messages.msg30")}
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