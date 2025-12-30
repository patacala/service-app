import {useEffect} from 'react';
import {Box} from '../../../design-system/components/layout/Box';
import {Typography} from '../../../design-system/components/foundation/Typography';
import {useDispatch} from 'react-redux';
import {fetchFavoritesStart} from '../slices/favorites.slice';

export const FavoritesScreen = () => {
  const dispatch = useDispatch();

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
