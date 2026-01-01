import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const intervals = ['1h','1d','7d','30d','1y'];

export default function HistoricalChart() {
  const [availableCryptos, setAvailableCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const particlesInit = async (main) => { await loadFull(main); };
  const particlesOptions = { background:{color:{value:'#0d1117'}}, particles:{ color:{value:'#00FFCC'}, links:{enable:true,color:'#00FFCC',distance:150}, move:{enable:true,speed:1.5}, size:{value:{min:1,max:4}}, opacity:{value:{min:0.3,max:0.7}} } };

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets',{ params:{ vs_currency:'usd', order:'market_cap_desc', per_page:50, page:1 } });
        setAvailableCryptos(res.data);
      } catch(e){ console.error(e); }
    };
    fetchTop();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const days = selectedInterval === '1h' ? '1' : selectedInterval;
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart`,{ params:{ vs_currency:'usd', days } });
        const prices = res.data.prices || [];
        const labels = prices.map((p) => new Date(p[0]).toLocaleTimeString());
        const data = prices.map((p) => p[1]);
        setChartData({ labels, datasets:[{ label: `${selectedCrypto.toUpperCase()} Price (USD)`, data, fill:false, borderColor:'#3498db', tension:0.3 }] });
      } catch(e){ setError('Error fetching chart data.'); }
      finally{ setLoading(false); }
    };
    if(selectedCrypto && selectedInterval) fetchData();
  }, [selectedCrypto, selectedInterval]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative">
      <Particles id="tsparticles-historical" init={particlesInit} options={particlesOptions} className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 max-w-4xl mx-auto mt-6 p-4">
        <h1 className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">Crypto Historical Chart</h1>
        <div className="mt-6 text-center">
          <select value={selectedCrypto} onChange={(e)=>setSelectedCrypto(e.target.value)} className="w-full md:w-72 p-2 rounded-md bg-blue-900 text-white border border-blue-500">
            <option value="" disabled>Select Crypto</option>
            {availableCryptos.map((coin)=> (<option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol?.toUpperCase()})</option>))}
          </select>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {intervals.map((iv)=> (
            <button key={iv} onClick={()=>setSelectedInterval(iv)} className={`text-sm px-3 py-2 rounded-md ${selectedInterval===iv? 'bg-blue-600 text-white' : 'border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white'}`}>{iv}</button>
          ))}
        </div>
        <div className="mt-6">
          {loading ? (<p className="text-center text-yellow-400">Loading chart...</p>) : error ? (<p className="text-center text-red-400">{error}</p>) : chartData && (<div className="w-full overflow-x-auto"><Line data={chartData} /></div>)}
        </div>
      </div>
    </div>
  );
}
