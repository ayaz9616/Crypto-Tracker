import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import AppShell from './layout/AppShell.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Auth from './pages/Auth.jsx';
import OtpGenerate from './pages/OtpGenerate.jsx';
import OtpValidate from './pages/OtpValidate.jsx';
import Overview from './pages/Overview.jsx';
import Home from './pages/Home.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Wallet from './pages/Wallet.jsx';
import TradeBuy from './pages/TradeBuy.jsx';
import TradeSell from './pages/TradeSell.jsx';
import Profile from './pages/Profile.jsx';
import Converter from './pages/Converter.jsx';
import HistoricalChart from './pages/HistoricalChart.jsx';
import CoinComparison from './pages/CoinComparison.jsx';
import Prediction from './pages/Prediction.jsx';
import NotFound from './pages/NotFound.jsx';

const queryClient = new QueryClient();
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              {/* Public routes */}
                {/* Public routes */}
                {/* <Route path="/" element={<Auth />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/otp/generate" element={<OtpGenerate />} />
              <Route path="/otp/validate" element={<OtpValidate />} />
              <Route path="/converter" element={<Converter />} />
              <Route path="/historical-chart" element={<HistoricalChart />} />
              <Route path="/compare" element={<CoinComparison />} />
              <Route path="/predict" element={<Prediction />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}> 
                <Route path="/overview" element={<Overview />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/trade/buy" element={<TradeBuy />} />
                <Route path="/trade/sell" element={<TradeSell />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Public home */}
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
