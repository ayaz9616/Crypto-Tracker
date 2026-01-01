import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaExchangeAlt, FaSpinner, FaDollarSign, FaCoins } from 'react-icons/fa';

export default function Converter() {
  const [cryptos, setCryptos] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState(1);
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const particlesInit = async (main) => { await loadFull(main); };
  const particlesOptions = {
    background: { color: { value: '#0d1117' } },
    particles: { color: { value: '#00FFCC' }, links: { enable: true, color: '#00FFCC', distance: 150 }, move: { enable: true, speed: 1.5 }, size: { value: { min: 1, max: 4 } }, opacity: { value: { min: 0.3, max: 0.7 } } }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cryptoRes = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        setCryptos(cryptoRes.data);
        const fiatRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setCurrencies(Object.keys(fiatRes.data.rates));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        if (fromCurrency && toCurrency) {
          const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`);
          const rate = res.data?.[fromCurrency]?.[toCurrency];
          setConversionRate(rate ?? null);
          setConvertedAmount(rate ? amount * rate : null);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchRate();
  }, [fromCurrency, toCurrency, amount]);

  const swapCurrencies = () => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative">
      <Particles id="tsparticles-converter" init={particlesInit} options={particlesOptions} className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500">Crypto Converter</h1>
          <p className="text-gray-300 mt-3">Convert cryptocurrencies to fiat with real-time rates.</p>
        </motion.div>

        <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2"><FaDollarSign className="inline mr-2" />Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-teal-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><FaCoins className="inline mr-2" />From</label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-lg">
                {cryptos.slice(0,100).map((c) => (<option key={c.id} value={c.id}>{c.name} ({c.symbol?.toUpperCase()})</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">To (Fiat)</label>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-lg">
                {currencies.slice(0,50).map((c) => (<option key={c} value={c}>{c.toUpperCase()}</option>))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between">
            <button onClick={swapCurrencies} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"><FaExchangeAlt /> Swap</button>
            <div className="text-right">
              <div className="text-sm text-gray-400">Rate</div>
              <div className="text-lg text-teal-400 font-semibold">{conversionRate ? `1 ${fromCurrency.toUpperCase()} = ${conversionRate} ${toCurrency.toUpperCase()}` : '—'}</div>
            </div>
          </div>
        </div>

        <motion.div className="mt-6 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 p-6 rounded-xl border border-teal-400/30" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Converted Amount</h3>
            {loading ? (
              <div className="flex items-center justify-center"><FaSpinner className="animate-spin text-teal-400 text-2xl mr-3" /><span className="text-teal-400">Converting...</span></div>
            ) : (
              <div className="text-3xl font-bold text-teal-400">{convertedAmount ? `${convertedAmount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:6})} ${toCurrency.toUpperCase()}` : 'Enter amount to convert'}</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
