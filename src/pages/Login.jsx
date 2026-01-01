import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  if (typeof document !== 'undefined') {
    document.title = 'Login • Crypto Sim';
  }

  const valid = username.trim().length > 0 && password.trim().length > 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!valid) {
      setError('Please fill in username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await loginApi(username, password);
      login({ username }, res.token);
      navigate('/overview');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sign In" subtitle="Access your account" />
      <div className="flex items-center justify-center min-h-[50vh]">
        <form onSubmit={onSubmit} className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <div className="flex items-center gap-2">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-xs px-2 py-2 rounded-md bg-gray-800 border border-gray-700 text-white">
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button disabled={loading || !valid} className={`w-full rounded-md py-2 text-white ${valid ? 'bg-gradient-to-r from-teal-500 to-blue-500' : 'bg-gray-700 cursor-not-allowed'}`}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-sm text-gray-400 text-center">Don't have an account? <a href="/register" className="text-teal-400 hover:text-teal-300">Sign Up</a></p>
        </form>
      </div>
    </div>
  );
}
