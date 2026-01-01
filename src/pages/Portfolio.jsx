import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPortfolio } from '../services/portfolio.js';
import PageHeader from '../components/PageHeader.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Portfolio() {
  if (typeof document !== 'undefined') {
    document.title = 'Portfolio • Crypto Sim';
  }

  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useQuery({ queryKey: ['portfolio'], queryFn: getPortfolio });
  const items = data?.portfolios || [];

  const filtered = useMemo(() => {
    if (!search) return items;
    return items.filter((p) =>
      [p.cryptoName, p.cryptoSymbol, p.cryptoId].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [items, search]);

  const totals = useMemo(() => {
    const totalInvested = items.reduce((sum, p) => sum + (p.amountInvested || 0), 0);
    const totalCurrent = items.reduce((sum, p) => sum + (p.currentValue || 0), 0);
    const totalPL = items.reduce((sum, p) => sum + (p.profitLoss || 0), 0);
    return { totalInvested, totalCurrent, totalPL, positions: items.length };
  }, [items]);

  const allocationData = useMemo(() => {
    const labels = items.map((p) => p.cryptoSymbol || p.cryptoName);
    const values = items.map((p) => p.currentValue || 0);
    const colors = labels.map((_, i) => `hsl(${(i * 47) % 360} 70% 45%)`);
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: '#1f2937',
        },
      ],
    };
  }, [items]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Portfolio"
        subtitle="Track your holdings, allocation, and performance"
        right={
          <div className="flex gap-2">
            <Link to="/trade/buy" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg">Buy</Link>
            <Link to="/trade/sell" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Sell</Link>
          </div>
        }
      />

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Invested" value={formatCurrency(totals.totalInvested)} />
          <Stat label="Current Value" value={formatCurrency(totals.totalCurrent)} />
          <Stat label="P/L" value={formatPL(totals.totalPL)} highlight />
          <Stat label="Positions" value={totals.positions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-700 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Holdings</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or symbol"
              className="w-64 max-w-[60%] bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white"
            />
          </div>

          {isLoading && <Loader label="Loading portfolio..." />}
          {error && (
            <EmptyState title="Failed to load portfolio" description="Please retry in a moment." />
          )}
          {!isLoading && !error && filtered.length === 0 && (
            <EmptyState title="No holdings" description="Your portfolio is empty. Buy cryptocurrencies to get started." action={<Link to="/trade/buy" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg">Buy Now</Link>} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p, idx) => (
              <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">
                      {p.cryptoName}
                      {p.cryptoSymbol && <span className="text-gray-400"> ({p.cryptoSymbol})</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {p.cryptoId}
                      {p.orderId ? ` • Order #${p.orderId}` : ''}
                    </div>
                  </div>
                  <PLBadge value={p.profitLoss} invested={p.amountInvested} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <KV label="Quantity" value={formatNumber(p.cryptoBroughtQuantity)} />
                  <KV label="Buy Price" value={formatCurrency(p.cryptoBroughtMarketPrice)} />
                  <KV label="Invested" value={formatCurrency(p.amountInvested)} />
                  <KV label="Current Value" value={formatCurrency(p.currentValue)} />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Link to="/trade/buy" className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm">Buy More</Link>
                  <Link to="/trade/sell" className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm">Sell</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 md:p-6">
          <h2 className="text-white font-semibold mb-4">Allocation</h2>
          {items.length > 0 ? (
            <Doughnut data={allocationData} />
          ) : (
            <EmptyState title="No data" description="You need holdings to view allocation." />
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight = false }) {
  return (
    <div className={`rounded-lg p-4 border ${highlight ? 'border-teal-500/50 bg-teal-500/10' : 'border-gray-700 bg-gray-800'}`}>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-xl font-semibold text-white mt-1">{value}</div>
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-white">{value}</div>
    </div>
  );
}

function PLBadge({ value = 0, invested = 0 }) {
  const color = value >= 0 ? 'text-green-400 bg-green-500/10 border-green-500/40' : 'text-red-400 bg-red-500/10 border-red-500/40';
  const percent = invested > 0 ? ((value / invested) * 100) : 0;
  const pctStr = `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  const valStr = `${value >= 0 ? '+' : ''}${formatCurrency(value)}`;
  return (
    <div className={`text-xs border rounded-full px-2 py-1 ${color}`}>{valStr} • {pctStr}</div>
  );
}

function formatCurrency(n = 0) {
  return `$${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatNumber(n = 0) {
  return (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 6 });
}
function formatPL(n = 0) {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${formatCurrency(n)}`;
}
