import { httpClient } from '../clients/httpClient';
import {
  RegisterPayload,
  VerifyOtpInitialPayload,
  VerifyOtpSimplePayload,
  ChangePasswordWithTokenPayload,
  LoginPayload,
} from '../types/auth.types';

export const register = (data: RegisterPayload) =>
  httpClient.post('/auth/register', data);

/* export const requestOtp = (payload: { userId: number; phonenumber: string }) =>
  httpClient.post('/auth/request-otp', payload);

export const requestOtpRecovery = (payload: { phonenumber: string }) =>
  httpClient.post('/auth/request-otp-recovery', payload);

export const verifyOtpInitial = (data: VerifyOtpInitialPayload) =>
  httpClient.post('/auth/verify-otp-initial', data); */

export const verifyOtpSimple = (data: VerifyOtpSimplePayload) =>
  httpClient.post('/auth/verify-otp-simple', data);

export const changePasswordWithToken = (data: ChangePasswordWithTokenPayload) =>
  httpClient.post('/auth/change-password-with-token', data);

export const login = async (data: LoginPayload) => {
  const response = await httpClient.post('/auth/firebase-login', data);
  return response;
};
