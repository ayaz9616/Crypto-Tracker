import { useState } from 'react';
import { generateOtp } from '../services/auth.js';

export default function OtpGenerate() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await generateOtp({ username });
      setMessage(res?.message || 'OTP generated');
    } catch {
      setMessage('Failed to generate OTP');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold text-white">Generate OTP</h1>
        <div>
          <label className="block text-gray-300 mb-1">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white" />
        </div>
        <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md py-2">Generate</button>
        {message && <p className="text-teal-400 text-sm">{message}</p>}
      </form>
    </div>
  );
}
