import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LoginCard />
      <SignupCard />
    </div>
  );
}

function LoginCard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Login</h2>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white" />
        </div>
        <button disabled={loading} className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md py-2">{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
    </div>
  );
}

function SignupCard() {
  const [form, setForm] = useState({ username: '', password: '', fullName: '', phoneNo: '', email: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await registerApi(form);
      setMessage(res?.message || 'Registered successfully');
    } catch (err) {
      setMessage('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Sign Up</h2>
      {message && <p className="text-teal-400 text-sm mb-2">{message}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        {['username','password','fullName','phoneNo','email'].map((key) => (
          <div key={key}>
            <label className="block text-gray-300 mb-1 capitalize">{key}</label>
            <input
              name={key}
              type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
              value={form[key]}
              onChange={onChange}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
            />
          </div>
        ))}
        <button disabled={loading} className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md py-2">{loading ? 'Registering...' : 'Create Account'}</button>
      </form>
    </div>
  );
}
