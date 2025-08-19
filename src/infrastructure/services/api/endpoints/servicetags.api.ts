import httpClient from '../clients/httpClient';
import { adaptService } from '../adapters/servicetags.adapter';

export const getServiceTagsById = async (id: string) => {
  const response = await httpClient.get(`/servicetags/${id}`);
  return adaptService(response.data);
};

export const getAllServiceTags = async () => {
  const response = await httpClient.get('/servicetags');
  return response.data.map(adaptService);
};
