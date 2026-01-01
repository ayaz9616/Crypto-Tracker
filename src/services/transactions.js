import api from './apiClient.js';

export async function addMoney(moneyToAdd) {
  const { data } = await api.post('/transaction/add-money', { moneyToAdd });
  return data; // BalanceRs
}

export async function buyCrypto(cryptoId, amountInvested) {
  const { data } = await api.post('/transaction/buy-crypto', { cryptoId, amountInvested });
  return data; // BalanceRs
}

export async function sellCrypto(cryptoId, cryptoOrderId) {
  const { data } = await api.post('/transaction/sell-crypto', { cryptoId, cryptoOrderId });
  return data; // BalanceRs
}
