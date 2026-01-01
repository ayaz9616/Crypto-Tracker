import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  if (typeof document !== 'undefined') {
    document.title = 'Profile • Crypto Sim';
  }

  const initial = String(user?.username || 'U').charAt(0).toUpperCase();
  const maskedToken = token ? `${token.slice(0, 12)}...${token.slice(-6)}` : 'Not available';

  const copyToken = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      alert('Token copied to clipboard');
    } catch {
      alert('Failed to copy');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Manage your account and preferences"
        right={
          <button onClick={logout} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium shadow">
            Logout
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow">
            {initial}
          </div>
          <div className="mt-3 text-white font-semibold">{user?.username || 'Unknown User'}</div>
          <div className="mt-1 text-gray-400 text-sm">Signed in</div>
          <div className="mt-4 flex gap-2">
            <Link to="/portfolio" className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm">View Portfolio</Link>
            <Link to="/wallet" className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm">Wallet</Link>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 gap-6">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
            <div className="space-y-3 text-gray-300">
              <div>
                <span className="text-gray-400">Username:</span> <span className="text-white font-medium">{user?.username || 'Unknown'}</span>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-gray-400">JWT:</span> <span className="text-white font-mono">{maskedToken}</span>
                {token && (
                  <button onClick={copyToken} className="text-xs bg-gray-800 border border-gray-700 text-white px-2 py-1 rounded">Copy</button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Environment</h2>
            <div className="space-y-2 text-gray-300">
              <div>
                <span className="text-gray-400">API Base URL:</span> <span className="text-white font-mono">{apiBase || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/overview" className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white">Overview</Link>
          <Link to="/portfolio" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">Portfolio</Link>
          <Link to="/wallet" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Wallet</Link>
          <Link to="/trade/buy" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">Buy</Link>
          <Link to="/trade/sell" className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white">Sell</Link>
        </div>
      </div>
    </div>
  );
}
