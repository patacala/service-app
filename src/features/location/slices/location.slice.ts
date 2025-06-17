import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Location {
  id: string;
  name: string;
}

interface LocationState {
  currentLocation: Location;
}

const initialState: LocationState = {
  currentLocation: { id: '1', name: 'Miami, FL' },
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<Location>) {
      state.currentLocation = action.payload;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
