import {Theme} from '../../../theme';

export type IconName =
  | 'search'
  | 'star'
  | 'user-circle'
  | 'invoice'
  | 'plus-circle'
  | 'chart-bar'
  | 'eye'
  | 'eye-off' 
  | 'clear'
  | 'left-arrow'
  | 'right-arrow'
  | 'palauster'
  | 'send'
  | 'location'
  | 'smile'
  | 'painter'
  | 'bookmark'
  | 'bookmark-other'
  | 'gardening'
  | 'transfer'
  | 'home'
  | 'tag'
  | 'dollar'
  | 'chevron-left'
  | 'date'
  | 'tutor'
  | 'sound'
  | 'picture';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: keyof Theme['colors'];
}

export const ICON_MAP: Record<IconName, string> = {
  'search': 'e901',
  'star': 'e915',
  'user-circle': 'e91a',
  'invoice': 'e91d',
  'plus-circle': 'e91e',
  'chart-bar': 'e91f',
  'eye': 'e916',
  'eye-off': 'e917',
  'clear': 'e90d',
  'left-arrow': 'e919',
  'right-arrow': 'e918',
  'palauster': 'e911',
  'send':'e90c',
  'location': 'e912',
  'smile':'e90f',
  'painter':'e910',
  'bookmark': 'e913',
  'bookmark-other': 'e91d',
  'gardening':'e904',
  'transfer':'e91C',
  'home':'e91b',
  'tag':'e903',
  'dollar':'e900',
  'chevron-left':'e90b',
  'date':'e907',
  'tutor':'e906',
  'sound':'e902',
  'picture':'e905'
};

export type IconNameType = keyof typeof ICON_MAP;
