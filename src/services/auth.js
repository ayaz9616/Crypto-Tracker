import api from './apiClient.js';

export async function login(username, password) {
  const { data } = await api.post('/login', { username, password });
  // expects { token, message }
  return data;
}

export async function register(payload) {
  const { data } = await api.post('/prelogin/register', payload);
  return data; // { message }
}

export async function generateOtp(payload) {
  const { data } = await api.post('/otp/generateOtp', payload);
  return data; // { message }
}

export async function validateOtp(payload) {
  const { data } = await api.post('/otp/validateOtp', payload);
  return data; // { message }
}
