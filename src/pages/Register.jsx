import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../services/auth.js';
import PageHeader from '../components/PageHeader.jsx';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', fullName: '', phoneNo: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (typeof document !== 'undefined') {
    document.title = 'Sign Up • Crypto Sim';
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const valid = form.username.trim() && form.password.trim() && form.password === form.confirmPassword;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    if (!valid) {
      setError('Please fill required fields and match passwords');
      setLoading(false);
      return;
    }
    try {
      const payload = { username: form.username, password: form.password, fullName: form.fullName, phoneNo: form.phoneNo, email: form.email };
      const res = await registerApi(payload);
      setMessage(res?.message || 'Registered');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Account" subtitle="Join Crypto Sim" />
      <div className="flex items-center justify-center min-h-[50vh]">
        <form onSubmit={onSubmit} className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
          {message && <p className="text-teal-400 text-sm">{message}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {['username','fullName','phoneNo','email'].map((key) => (
            <div key={key}>
              <label className="block text-gray-300 mb-1 capitalize">{key}</label>
              <input
                name={key}
                type={key === 'email' ? 'email' : 'text'}
                value={form[key]}
                onChange={onChange}
                className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              />
            </div>
          ))}
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
            />
          </div>
          <button disabled={loading || !valid} className={`w-full rounded-md py-2 text-white ${valid ? 'bg-gradient-to-r from-teal-500 to-blue-500' : 'bg-gray-700 cursor-not-allowed'}`}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="text-sm text-gray-400 text-center">Already have an account? <a href="/login" className="text-teal-400 hover:text-teal-300">Login</a></p>
        </form>
      </div>
    </div>
  );
}
