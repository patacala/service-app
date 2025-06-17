import { httpClient } from '../clients/httpClient';

export const updateUserProfile = async (data: {
  phoneNumber: string;
  city: string;
  services: string[];
}) => {
  const response = await httpClient.patch('/users/me', data);
  return response.data;
};

