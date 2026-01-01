import api from './apiClient.js';

export async function getPortfolio() {
  const { data } = await api.get('/crypto-portfolio/get-portfolio');
  return data; // CryptoPortfolioRs
}
