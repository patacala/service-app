import { httpClient } from '../clients/httpClient';
import {
  RegisterPayload,
  LoginPayload,
} from '../types/auth.types';

export const register = (data: RegisterPayload) =>
  httpClient.post('/auth/register', data);

export const firebaseLogin = async (data: LoginPayload) => {
  const response = await httpClient.post('/auth/firebase-login', data);
  return response;
};
