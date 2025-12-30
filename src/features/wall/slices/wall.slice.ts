import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import { ImageSourcePropType } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { IconName } from '@/design-system/components/layout/Icon';

export interface CardPost {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  categories: string[];
  category: string;
  name: string;
  provider: {
    id: string;
    name: string;
  };
  city?: string | null;
  lat?: number | null;
  lon?: number | null;
  createdAt: string;
  updatedAt: string;
  type: string;
  rating: number;
  distance: number;
  location: string;
  isFavorite: boolean;
  media: [];
}

export interface Post {
  id: string;
  price: number;
  name: string;
  type: string;
  category: string;
  rating: Float;
  distance: Float;
  location: string;
  miniImage: ImageSourcePropType;
  image: ImageSourcePropType;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WallState {
  posts: CardPost[];
  selectedPost: CardPost | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  };
  categories: { id: string; label: string; icon?: IconName }[];
  pinnedServices: { id: string; label: string; icon?: IconName }[];
  allServices: { id: string; label: string }[];
  locations: { id: string; name: string }[];
  recentLocations: { id: string; name: string }[];
}

const initialState: WallState = {
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
  filters: {},
  categories: [],
  pinnedServices: [],
  allServices: [],
  locations: [],
  recentLocations: []
};

// Datos de muestra que simulan respuesta del servidor
const samplePosts: CardPost[] = [/* 
  {
    id: '1',
    price: 15,
    name: 'Robert Taylor',
    type: 'Service', 
    category: 'Painter',
    rating: 4.2,
    distance: 1.5,
    location: 'Miami, FL',
    miniImage: images.profile1 as ImageSourcePropType,
    image: images.cardImage1 as ImageSourcePropType,
    isFavorite: true,
    createdAt: '2023-05-10T09:30:00Z',
    updatedAt: '2023-05-10T09:30:00Z',
  },
  {
    id: '2',
    price: 22,
    name: 'Darius Robinson',
    type: 'Service', 
    category: 'Construction',
    rating: 4.2,
    distance: 1.5,
    location: 'Miami, FL',
    miniImage: images.profile2 as ImageSourcePropType,
    image: images.cardImage2 as ImageSourcePropType,
    isFavorite: false,
    createdAt: '2023-05-10T09:30:00Z',
    updatedAt: '2023-05-10T09:30:00Z',
  },
  {
    id: '3',
    price: 30,
    name: 'Alexa Jhonasson',
    type: 'Service', 
    category: 'Babysister',
    rating: 4.2,
    distance: 1.5,
    location: 'Miami, FL',
    miniImage: images.profile3 as ImageSourcePropType,
    image: images.cardImage3 as ImageSourcePropType,
    isFavorite: false,
    createdAt: '2023-05-10T09:30:00Z',
    updatedAt: '2023-05-10T09:30:00Z',
  },
  {
    id: '4',
    price: 25,
    name: 'John Carpenter',
    type: 'Service',
    category: 'Carpenter',
    rating: 4.5,
    distance: 2.2,
    location: 'Chicago, IL',
    miniImage: images.profile1 as ImageSourcePropType,
    image: images.cardImage1 as ImageSourcePropType,
    isFavorite: true,
    createdAt: '2023-05-12T10:30:00Z',
    updatedAt: '2023-05-12T10:30:00Z',
  },
  {
    id: '5',
    price: 35,
    name: 'Michael Edison',
    type: 'Service',
    category: 'Electrician',
    rating: 4.8,
    distance: 3.1,
    location: 'Chicago, IL',
    miniImage: images.profile2 as ImageSourcePropType,
    image: images.cardImage2 as ImageSourcePropType,
    isFavorite: false,
    createdAt: '2023-05-14T14:30:00Z',
    updatedAt: '2023-05-14T14:30:00Z',
  } */
];

const sampleCategories = [
  { id: 'all', label: 'All' },
  { id: 'painter', label: 'Painter', icon: 'painter' as IconName },
  { id: 'construction', label: 'Construction', icon: 'palauster' as IconName },
  { id: 'babysister', label: 'Babysitter', icon: 'smile' as IconName },
  { id: 'plumbing', label: 'Plumbing', icon: 'star' as IconName },
  { id: 'cleaning', label: 'Cleaning', icon: 'star' as IconName },
  { id: 'gardening', label: 'Gardening', icon: 'gardening' as IconName },
];

const samplePinnedServices = [
  { id: 'construction', label: 'Construction', icon: 'palauster' as IconName },
  { id: 'coaching', label: 'Coaching', icon: 'smile' as IconName },
  { id: 'painter', label: 'Painter', icon: 'painter' as IconName },
  { id: 'tutor', label: 'Tutor', icon: 'star' as IconName },
  { id: 'plumbing', label: 'Plumbing', icon: 'star' as IconName },
  { id: 'gardening', label: 'Gardening', icon: 'star' as IconName },
];

const sampleAllServices = [
  { id: 'carpenter', label: 'Carpenter' },
  { id: 'electrician', label: 'Electrician' },
  { id: 'mechanic', label: 'Mechanic' },
  { id: 'cleaner', label: 'Cleaner' },
  { id: 'handyman', label: 'Handyman' },
  { id: 'dj', label: 'DJ' },
  { id: 'chef', label: 'Chef' },
  { id: 'web_developer', label: 'Web Developer' },
  { id: 'makeup_artist', label: 'Makeup Artist' },
  { id: 'photographer', label: 'Photographer' },
  { id: 'dog_walker', label: 'Dog Walker' },
  { id: 'therapist', label: 'Therapist' },
];

interface LocationItem {
  id: string;
  name: string;
}

const sampleLocations: LocationItem[] = [
  { id: 'al', name: 'Alabama, AL' },
  { id: 'ak', name: 'Alaska, AK' },
  { id: 'az', name: 'Arizona, AZ' },
  { id: 'ar', name: 'Arkansas, AR' },
  { id: 'ca', name: 'California, CA' },
  { id: 'co', name: 'Colorado, CO' },
  { id: 'ct', name: 'Connecticut, CT' },
  { id: 'de', name: 'Delaware, DE' },
  { id: 'fl', name: 'Florida, FL' },
  { id: 'ga', name: 'Georgia, GA' },
  { id: 'hi', name: 'Hawaii, HI' },
  { id: 'id', name: 'Idaho, ID' },
  { id: 'il', name: 'Illinois, IL' },
  { id: 'in', name: 'Indiana, IN' },
  { id: 'ia', name: 'Iowa, IA' },
  { id: 'ks', name: 'Kansas, KS' },
  { id: 'ky', name: 'Kentucky, KY' },
  { id: 'la', name: 'Louisiana, LA' },
  { id: 'me', name: 'Maine, ME' },
  { id: 'md', name: 'Maryland, MD' },
  { id: 'ma', name: 'Massachusetts, MA' },
  { id: 'mi', name: 'Michigan, MI' },
  { id: 'mn', name: 'Minnesota, MN' },
  { id: 'ms', name: 'Mississippi, MS' },
  { id: 'mo', name: 'Missouri, MO' },
  { id: 'mt', name: 'Montana, MT' },
  { id: 'ne', name: 'Nebraska, NE' },
  { id: 'nv', name: 'Nevada, NV' },
  { id: 'nh', name: 'New Hampshire, NH' },
  { id: 'nj', name: 'New Jersey, NJ' },
  { id: 'nm', name: 'New Mexico, NM' },
  { id: 'ny', name: 'New York, NY' },
  { id: 'nc', name: 'North Carolina, NC' },
  { id: 'nd', name: 'North Dakota, ND' },
  { id: 'oh', name: 'Ohio, OH' },
  { id: 'ok', name: 'Oklahoma, OK' },
  { id: 'or', name: 'Oregon, OR' },
  { id: 'pa', name: 'Pennsylvania, PA' },
  { id: 'ri', name: 'Rhode Island, RI' },
  { id: 'sc', name: 'South Carolina, SC' },
  { id: 'sd', name: 'South Dakota, SD' },
  { id: 'tn', name: 'Tennessee, TN' },
  { id: 'tx', name: 'Texas, TX' },
  { id: 'ut', name: 'Utah, UT' },
  { id: 'vt', name: 'Vermont, VT' },
  { id: 'va', name: 'Virginia, VA' },
  { id: 'wa', name: 'Washington, WA' },
  { id: 'wv', name: 'West Virginia, WV' },
  { id: 'wi', name: 'Wisconsin, WI' },
  { id: 'wy', name: 'Wyoming, WY' },
  { id: 'dc', name: 'District of Columbia, DC' },
  { id: 'miami', name: 'Miami, FL' },
];

const initialRecentCities: LocationItem[] = [];

// Thunk para obtener posts (simular llamado a API)
export const fetchPosts = createAsyncThunk(
  'wall/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));    
      return samplePosts;
    } catch {
      return rejectWithValue('Error al cargar los posts');
    }
  }
);

// Thunk para obtener categorías
export const fetchCategories = createAsyncThunk(
  'wall/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleCategories;
    } catch {
      return rejectWithValue('Error al cargar las categorías');
    }
  }
);

// Thunk para obtener servicios
export const fetchServices = createAsyncThunk(
  'wall/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        pinnedServices: samplePinnedServices,
        allServices: sampleAllServices
      };
    } catch {
      return rejectWithValue('Error al cargar los servicios');
    }
  }
);

// Thunk para obtener localizaciones
export const fetchLocations = createAsyncThunk(
  'wall/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleLocations;
    } catch {
      return rejectWithValue('Error al cargar las ubicaciones');
    }
  }
);

const wallSlice = createSlice({
  name: 'wall',
  initialState,
  reducers: {
    selectPost: (state, action: PayloadAction<CardPost>) => {
      state.selectedPost = action.payload;
    },
    createPostStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    createPostSuccess: (state, action: PayloadAction<CardPost>) => {
      state.isLoading = false;
      state.posts.unshift(action.payload);
    },
    createPostFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<WallState['filters']>) => {
      state.filters = action.payload;
    },
    addRecentLocation: (state, action: PayloadAction<{ id: string; name: string }>) => {
      // Eliminar si ya existe para evitar duplicados
      const filtered = state.recentLocations.filter(loc => loc.id !== action.payload.id);
      // Agregar al inicio de la lista
      state.recentLocations = [action.payload, ...filtered];
      // Mantener solo los últimos 5
      if (state.recentLocations.length > 5) {
        state.recentLocations = state.recentLocations.slice(0, 5);
      }
    },
    setInitialRecentLocations: (state) => {
      state.recentLocations = initialRecentCities;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pinnedServices = action.payload.pinnedServices;
        state.allServices = action.payload.allServices;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLocations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectPost,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  setFilters,
  addRecentLocation,
  setInitialRecentLocations
} = wallSlice.actions;

export default wallSlice.reducer;