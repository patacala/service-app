import {useEffect} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import {Box} from '../../../design-system/components/layout/Box';
import {Typography} from '../../../design-system/components/foundation/Typography';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {fetchFavoritesStart} from '../slices/favorites.slice';
import {useNavigation} from '@react-navigation/native';
import {Post} from '../../wall/slices/wall.slice';

export const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {items: favorites, isLoading} = useSelector(
    (state: RootState) => state.favorites,
  );

  useEffect(() => {
    dispatch(fetchFavoritesStart());
  }, [dispatch]);

  /* const renderItem: ListRenderItem<Post> = ({item}) => (
    <PostCard
      post={item}
      isFavorite={true}
      onPress={() => navigation.navigate('PostDetails', {postId: item.id})}
    />
  ); */

  return (
    <Box flex={1} padding="lg" backgroundColor="colorBackgroundPrimary">
      <Box paddingBottom="md">
        <Typography variant="bodyLarge" color="colorTextPrimary">
          Favorites
        </Typography>
      </Box>

      {/* <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingTop: 16}}
        ListEmptyComponent={
          !isLoading ? (
            <Box alignItems="center" justifyContent="center" paddingTop="xl">
              <Typography variant="bodyMedium" color="colorTextSecondary">
                No favorites yet
              </Typography>
            </Box>
          ) : null
        }
      /> */}
    </Box>
  );
};
