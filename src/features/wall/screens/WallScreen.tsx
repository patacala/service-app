import {useEffect, useState} from 'react';
import {FlatList, Image, ImageSourcePropType, ListRenderItem, ActivityIndicator} from 'react-native';
import {Box} from '../../../design-system/components/layout/Box';
import {Typography} from '../../../design-system/components/foundation/Typography';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store';
import {fetchPosts, fetchCategories, fetchServices, CardPost, setFilters} from '../slices/wall.slice';
import {addToFavorites} from '../../favorites/slices/favorites.slice';
import { Button, GroupChipSelector, Input, theme } from '@/design-system';
import { Row } from '@/design-system/components/layout/Row/Row';
import images from '@/assets/images/images';
import { Post } from '../components/Post';
import { FilterActionSheet } from '../components/FilterActionSheet';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/assembler/navigation/types';
import { getWallStyles } from './wall/wall.style';

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
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.wall.categories);
  const posts = useSelector((state: RootState) => state.wall.posts);
  const isLoadingPosts = useSelector((state: RootState) => state.wall.isLoading);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const currentLocation = useSelector((state: RootState) => state.location.currentLocation);
  
  const [filteredPosts, setFilteredPosts] = useState<CardPost[]>([]); 
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    tags: string[];
    minPrice: number;
    maxPrice: number;
  }>({
    tags: [],
    minPrice: 10,
    maxPrice: 62
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPosts());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      const initialFavorites = posts.filter(post => post.isFavorite);
      initialFavorites.forEach(post => dispatch(addToFavorites(post)));
      
      const filtered = applyFiltersMultipleCategories(
        'all',
        '',
        activeFilters,
        currentLocation
      );
      setFilteredPosts(filtered);
    }
  }, [posts]);

  useEffect(() => {
    if (posts.length === 0) return;
    
    const categoriesToUse = selectedCategories.includes('all') 
      ? 'all' 
      : selectedCategories;
    
    const filtered = applyFiltersMultipleCategories(
      categoriesToUse, 
      searchQuery, 
      activeFilters,
      currentLocation
    );
    
    setFilteredPosts(filtered);
    
  }, [selectedCategories, posts, currentLocation]);

  useEffect(() => {
    if (posts.length === 0) return;
    
    const categoriesToUse = selectedCategories.includes('all') 
      ? 'all' 
      : selectedCategories;
    
    const filtered = applyFiltersMultipleCategories(
      categoriesToUse, 
      searchQuery, 
      activeFilters,
      currentLocation
    );

    setFilteredPosts(filtered);
    
  }, [activeFilters, searchQuery]);

  const applyFiltersMultipleCategories = (categories: string | string[], query: string, advancedFilters: any = {}, location?: Location) => {
    let result = [...posts];
    
    if (advancedFilters.minPrice !== undefined) {
      result = result.filter(post => post.price >= advancedFilters.minPrice);
    }
    
    if (advancedFilters.maxPrice !== undefined) {
      result = result.filter(post => post.price <= advancedFilters.maxPrice);
    }
    
    if (advancedFilters.tags && advancedFilters.tags.length > 0) {
      result = result.filter(post => {
        const postCategory = post.category.toLowerCase();
        
        return advancedFilters.tags.some((tag: string) => {
          return postCategory === tag.toLowerCase();
        });
      });
    } else if (categories !== 'all') {
      const categoriesArray = Array.isArray(categories) ? categories : [categories];
      
      result = result.filter(post => {
        const postCategory = post.category.toLowerCase();
        return categoriesArray.some(cat => postCategory === cat.toLowerCase());
      });
    }

    if (location) {
      result = result.filter(post => post.location === location.name);
    }

    if (query.trim() !== '') {
      const searchTerms = query.toLowerCase().trim().split(' ');
      result = result.filter(post => {
        const postText = `${post.name} ${post.category} ${post.type}`.toLowerCase();
        return searchTerms.some(term => postText.includes(term));
      });
    }
    
    return result;
  };

  const handleCategoryChange = (selectedIds: string[]) => {
    let newSelectedIds = [...selectedIds];
    
    if (newSelectedIds.length === 0) {
      newSelectedIds = ['all'];
    } else if (selectedIds.includes('all') && !selectedCategories.includes('all')) {
      newSelectedIds = ['all'];
    } 
    else if (selectedIds.includes('all') && selectedIds.length > 1) {
      newSelectedIds = selectedIds.filter(id => id !== 'all');
    }
    
    setSelectedCategories(newSelectedIds);
    const tagsToSend = newSelectedIds.includes('all') ? [] : newSelectedIds;
    
    const updatedFilters = {
      ...activeFilters,
      tags: tagsToSend
    };
    dispatch(setFilters(updatedFilters));
    setActiveFilters(updatedFilters);
    
    const categoryToUse = newSelectedIds.includes('all') ? 'all' : newSelectedIds;
    const filtered = applyFiltersMultipleCategories(
      categoryToUse, 
      searchQuery, 
      updatedFilters,
      currentLocation
    );
    setFilteredPosts(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    const categoriesToUse = selectedCategories.includes('all') 
      ? 'all' 
      : selectedCategories;
    
    const filtered = applyFiltersMultipleCategories(
      categoriesToUse, 
      text, 
      activeFilters,
      currentLocation
    );
    
    setFilteredPosts(filtered);
  };
  
  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    dispatch(setFilters(filters));
    
    if (!filters.tags || filters.tags.length === 0) {
      setSelectedCategories(['all']);
      
      const filtered = applyFiltersMultipleCategories(
        'all', 
        searchQuery, 
        {
          ...filters,
          tags: []
        },
        currentLocation
      );
      setFilteredPosts(filtered);
    } else {
      updateSelectedCategoriesFromFilter(filters.tags);
      
      const filtered = applyFiltersMultipleCategories(
        'all', 
        searchQuery, 
        filters,
        currentLocation
      );
      setFilteredPosts(filtered);
    }
  };
  
  const updateSelectedCategoriesFromFilter = (tags: string[]) => {
    if (!tags || tags.length === 0) {
      if (!selectedCategories.includes('all')) {
        setSelectedCategories(['all']);
      }
      return;
    }
    
    const matchingCategoryIds = categories
      .filter((category: { id: string; }) => 
        tags.some(tag => 
          category.id !== 'all' && 
          tag.toLowerCase() === category.id.toLowerCase()
        )
      )
      .map((category: { id: any; }) => category.id);
    
    if (matchingCategoryIds.length > 0) {
      setSelectedCategories(matchingCategoryIds);
    } else {
      if (!selectedCategories.includes('all')) {
        setSelectedCategories(['all']);
      }
    }
  };

  const handlePostDetail = (item: CardPost) => {
    navigation.navigate('ServiceDetail', {
      post: item
    });
  };
  
  const renderItem: ListRenderItem<CardPost> = ({item}) => (
    <Post
      post={item}
      isFavorite={favorites.some((fav: { id: string; }) => fav.id === item.id)}
      onPress={() => handlePostDetail(item)}
    />
  );

  return (
    <>
      <Box marginTop="lg">
        <Row justifyContent="space-between" alignItems="center">
          <Box style={{ flex: 1}}>
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
          options={categories}
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
          data={filteredPosts}
          keyExtractor={(item: { id: any; }) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            getWallStyles.listContainer,
            { height: filteredPosts.length > 0 ? "auto" : "100%" }
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