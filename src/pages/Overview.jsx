import { useQuery } from '@tanstack/react-query';
import { getPrices } from '../services/overview.js';

const fmtCurrency = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
    : n;
const fmtNumber = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)
    : n;

export default function Overview() {
  const { data, isLoading, error } = useQuery({ queryKey: ['prices'], queryFn: getPrices });
  const items = Array.isArray(data)
    ? data
    : data?.cryptoTableDTOS || data?.cryptoTableDTOs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold">Market Overview</h1>
        <span className="text-sm text-gray-400">{items.length} assets</span>
      </div>

      {isLoading && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-800 rounded mb-4"></div>
          <div className="h-10 w-full bg-gray-800 rounded"></div>
        </div>
      )}

      {error && <p className="text-red-400">Failed to load overview.</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="min-w-full bg-gray-900">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">24h %</th>
                <th className="px-4 py-3">Market Cap</th>
                <th className="px-4 py-3">24h Vol</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => {
                const price = Number(c?.current_price ?? c?.currentPrice);
                const changePct = Number(c?.price_change_percentage_24h ?? c?.priceChangePercentage24h);
                const cap = Number(c?.market_cap ?? c?.marketCap);
                const vol = Number(c?.total_volume ?? c?.totalVolume);
                return (
                  <tr key={c?.id ?? c?.symbol} className="border-t border-gray-800 hover:bg-gray-800/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {c?.image && <img src={c.image} alt={c?.name} className="w-6 h-6 rounded" />}
                        <div>
                          <div className="font-semibold text-white">{c?.name}</div>
                          <div className="text-xs text-teal-400">{c?.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 uppercase text-gray-300">{c?.symbol}</td>
                    <td className="px-4 py-3 text-white">{fmtCurrency(price)}</td>
                    <td className={`px-4 py-3 ${changePct >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmtNumber(changePct)}%</td>
                    <td className="px-4 py-3 text-gray-300">{fmtNumber(cap)}</td>
                    <td className="px-4 py-3 text-gray-300">{fmtNumber(vol)}</td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-400" colSpan={6}>No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
