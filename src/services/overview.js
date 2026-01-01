import api from './apiClient.js';

export async function getPrices() {
  const { data } = await api.get('/crypto-overview/prices');
  return data; // OverviewRs
}
