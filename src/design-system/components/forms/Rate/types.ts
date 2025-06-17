export interface RateProps {
  maxRating?: number;
  defaultRating?: number;
  size?: number;
  showLabel?: boolean;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}