export interface RegisterPayload {
  name: string;
  city: string;
  /* email: string;
  password: string; */
}

export interface VerifyOtpInitialPayload {
  userId: number;
  code: string;
  city: string;
  servicetagids: number[];
}

export interface VerifyOtpSimplePayload {
  code: string;
  phonenumber: string;
}

export interface ChangePasswordWithTokenPayload  {
  token: string;
  newPassword: string;
  repeatPassword: string;
}

export interface LoginPayload {
  firebaseToken: string;
}
