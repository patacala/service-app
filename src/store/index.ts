import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/auth.slice';
import wallReducer from '../features/wall/slices/wall.slice';
import favoritesReducer from '../features/favorites/slices/favorites.slice';
import profileReducer from '../features/profile/slices/profile.slice';
import analyticsReducer from '../features/analytics/slices/analytics.slice';
import locationReducer from '../features/location/slices/location.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wall: wallReducer,
    favorites: favoritesReducer,
    profile: profileReducer,
    analytics: analyticsReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
