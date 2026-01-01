import api from './apiClient.js';

export async function getBalance() {
  const { data } = await api.get('/wallet/get-balance');
  return data; // { balance }
}

export async function createWallet() {
  const { data } = await api.get('/wallet/create-wallet');
  return data; // { message }
}

export async function blockUnblock() {
  const { data } = await api.get('/wallet/block-unblock-wallet');
  return data; // { message }
}

export async function getStatement() {
  const { data } = await api.get('/wallet/get-wallet-statement');
  return data; // { statements: WalletStatementDTO[] }
}
