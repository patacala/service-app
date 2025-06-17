export interface ThemeColors {
  colorBaseBlack: string;
  colorBaseWhite: string;
  colorGrey100: string;
  colorGrey200: string;
  colorGrey300: string;
  colorGrey400: string;
  colorGrey500: string;
  colorGrey600: string;
  colorBrandPrimary: string;
  colorBrandSecondary: string;
  colorTextPrimary: string;
  colorTextSecondary: string;
  colorBackgroundPrimary: string;
  colorBackgroundSecondary: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeText {
  heading: {
    primary: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    secondary: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
  };
  body: {
    regular: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    large: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    medium: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    small: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
    xsmall: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      fontWeight: string;
    };
  };
}

export interface ThemeBorder {
  solid: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  radius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    pill: string;
    circle: string;
  };
}
