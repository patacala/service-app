import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  avatar: string | null;
  city: string;
  address: string;
  contactInfo: {
    email: string;
    phone?: string;
  };
}

interface ProfileState {
  data: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateProfileStart: (state, action: PayloadAction<Profile>) => {
      state.isLoading = true;
      state.error = action.payload.bio;
    },
    updateProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} = profileSlice.actions;

export default profileSlice.reducer;
