import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { addMoney } from '../services/transactions.js';
import { getBalance, createWallet } from '../services/wallet.js';
import { generateOtp, validateOtp } from '../services/auth.js';

export default function Wallet() {
  if (typeof document !== 'undefined') {
    document.title = 'Wallet • Crypto Sim';
  }
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState(''); // generic status message
  const [loading, setLoading] = useState(false);

  // OTP flow state
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpValidated, setOtpValidated] = useState(false);

  useEffect(() => {
    // Try to fetch existing balance; if wallet doesn't exist, show create flow
    (async () => {
      try {
        const res = await getBalance();
        setBalance(res?.balance ?? null);
      } catch (err) {
        // Likely wallet not found; enable create flow
        setBalance(null);
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        throw new Error('Invalid amount');
      }
      const res = await addMoney(amt);
      setBalance(res?.balance ?? null);
      setStatus('Wallet updated successfully');
      setAmount('');
    } catch {
      setStatus('Failed to update wallet');
    } finally {
      setLoading(false);
    }
  };

  const onGenerateOtp = async () => {
    setLoading(true);
    setStatus('');
    try {
      await generateOtp({ code: 'CREATE_WALLET' });
      setOtpRequested(true);
      setStatus('OTP sent to your email');
    } catch {
      setStatus('Failed to generate OTP');
    } finally {
      setLoading(false);
    }
  };

  const onValidateOtp = async () => {
    setLoading(true);
    setStatus('');
    try {
      await validateOtp({ id: otpCode, code: 'CREATE_WALLET' });
      setOtpValidated(true);
      setStatus('OTP validated');
    } catch {
      setStatus('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const onCreateWallet = async () => {
    setLoading(true);
    setStatus('');
    try {
      await createWallet();
      setStatus('Wallet created successfully');
      // Fetch balance after creation
      const res = await getBalance();
      setBalance(res?.balance ?? 0);
    } catch {
      setStatus('Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Wallet" subtitle="Create and manage your wallet, add funds, and view balance" />

      {balance == null && (
        <div className="max-w-lg bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Create Wallet</h2>
          <p className="text-gray-300 text-sm">To create your wallet, please request and validate an OTP.</p>

          <div className="space-y-3">
            <button
              onClick={onGenerateOtp}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md py-2"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Generate OTP'}
            </button>

            {otpRequested && (
              <div className="space-y-2">
                <label className="block text-gray-300 mb-1">Enter OTP</label>
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
                  placeholder="6-digit code"
                />
                <button
                  onClick={onValidateOtp}
                  className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-md py-2"
                  disabled={loading || !otpCode}
                >
                  {loading ? 'Validating...' : 'Validate OTP'}
                </button>
              </div>
            )}

            <button
              onClick={onCreateWallet}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-md py-2"
              disabled={!otpValidated || loading}
            >
              {loading ? 'Creating...' : 'Create Wallet'}
            </button>
          </div>

          {status && <p className="text-teal-400 text-sm">{status}</p>}
        </div>
      )}

      {balance != null && (
        <form onSubmit={onSubmit} className="max-w-lg bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold">Current Balance</p>
            <p className="text-teal-400 text-lg">${Number(balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Add Amount (USD)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              placeholder="e.g. 100.00"
            />
          </div>
          <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md py-2" disabled={loading}>
            {loading ? 'Updating...' : 'Add Money'}
          </button>
          {loading && <Loader label="Updating wallet..." />}
          {!loading && status && (
            status.toLowerCase().includes('failed') ? (
              <p className="text-red-400 text-sm">{status}</p>
            ) : (
              <p className="text-green-400 text-sm">{status}</p>
            )
          )}
        </form>
      )}
    </div>
  );
}
