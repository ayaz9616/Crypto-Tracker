import axios from 'axios';


// Use only the env variable for backend URL
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // optional: emit event for logout
      console.warn('Unauthorized. Redirecting to login.');
    }
    return Promise.reject(err);
  }
);

// Endpoint wrappers
export const AuthApi = {
  login: (payload) => api.post('/login', payload),
  register: (payload) => api.post('/prelogin/register', payload),
  // Backend accepts GET with JSON body: { code: "CREATE_WALLET" }
  otpGenerate: (payload) =>
    api.request({ method: 'get', url: '/otp/generateOtp', data: payload, headers: { 'Content-Type': 'application/json' } }),
  otpValidate: (payload) => api.post('/otp/validateOtp', payload),
};

export const WalletApi = {
  balance: () => api.get('/wallet/get-balance'),
  create: () => api.get('/wallet/create-wallet'),
  blockUnblock: () => api.get('/wallet/block-unblock-wallet'),
  addMoney: (payload) => api.post('/transaction/add-money', payload),
  statement: () => api.get('/wallet/get-wallet-statement'),
};

export const PortfolioApi = {
  get: () => api.get('/crypto-portfolio/get-portfolio'),
  sell: (payload) => api.post('/transaction/sell-crypto', payload),
};

export const OverviewApi = {
  prices: () => api.get('/crypto-overview/prices'),
};

export const TradeApi = {
  buy: (payload) => api.post('/transaction/buy-crypto', payload),
  sell: (payload) => api.post('/transaction/sell-crypto', payload),
};
