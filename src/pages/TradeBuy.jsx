import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { buyCrypto } from '../services/transactions.js';
import { getBalance } from '../services/wallet.js';

export default function TradeBuy() {
  if (typeof document !== 'undefined') {
    document.title = 'Buy Crypto • Crypto Sim';
  }

  const location = useLocation();
  const prefillId = useMemo(() => new URLSearchParams(location.search).get('id') || '', [location.search]);

  const [cryptoId, setCryptoId] = useState(prefillId);
  const [amountInvested, setAmountInvested] = useState('');

  useEffect(() => {
    if (prefillId) setCryptoId(prefillId);
  }, [prefillId]);

  const { data: balData, isLoading: balLoading, error: balError, refetch: refetchBalance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: getBalance,
  });

  const { mutate, isPending, isSuccess, isError, data: result, reset } = useMutation({
    mutationFn: async () => {
      return await buyCrypto(cryptoId.trim(), Number(amountInvested));
    },
    onSuccess: () => {
      refetchBalance();
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    reset();
    if (!cryptoId.trim()) return;
    const amt = Number(amountInvested);
    if (!Number.isFinite(amt) || amt <= 0) return;
    mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buy Crypto"
        subtitle="Enter a crypto ID and invested amount to execute a market buy"
        right={<Link to="/portfolio" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">View Portfolio</Link>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gray-900 border border-gray-700 rounded-xl p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Crypto ID</label>
              <input
                value={cryptoId}
                onChange={(e) => setCryptoId(e.target.value)}
                placeholder="e.g., bitcoin, ethereum"
                className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Amount Invested (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amountInvested}
                onChange={(e) => setAmountInvested(e.target.value)}
                placeholder="e.g., 100.00"
                className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              />
            </div>
            <button
              disabled={isPending}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md py-2 disabled:opacity-60"
            >
              {isPending ? 'Processing...' : 'Buy'}
            </button>

            {isPending && <Loader label="Submitting order..." />}
            {isSuccess && (
              <div className="text-sm text-green-400">
                Buy successful. {result?.balance != null && `New balance: $${Number(result.balance).toLocaleString()}`}
              </div>
            )}
            {isError && (
              <div className="text-sm text-red-400">Failed to buy. Please verify inputs and try again.</div>
            )}
          </form>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3">Wallet Summary</h2>
          {balLoading && <Loader label="Fetching balance..." />}
          {balError && <EmptyState title="Failed to load" description="Unable to fetch wallet balance." />}
          {!balLoading && !balError && (
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Current Balance</div>
              <div className="text-2xl font-semibold text-white">${Number(balData?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="text-xs text-gray-500 mt-2">Tip: Ensure sufficient balance before buying.</div>
              <div className="mt-4 flex gap-2">
                <Link to="/wallet" className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm">Manage Wallet</Link>
                <Link to="/trade/sell" className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm">Sell Crypto</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
