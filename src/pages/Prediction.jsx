import { useState } from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function Prediction() {
  const [coin, setCoin] = useState('bitcoin');
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const particlesInit = async (main) => { await loadFull(main); };
  const particlesOptions = { background:{ color:{ value:'#0d1117' } }, particles:{ color:{ value:'#00FFCC' }, links:{ enable:true, color:'#00FFCC', distance:150 }, move:{ enable:true, speed:1.5 }, size:{ value:{ min:1, max:4 } }, opacity:{ value:{ min:0.3, max:0.7 } } } };

  const fetchPrediction = async () => {
    setLoading(true); setStatus(''); setData(null);
    try {
      const base = import.meta?.env?.VITE_PREDICT_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${base}/predict/${coin}`);
      if(!res.ok) throw new Error('Prediction service unavailable');
      const json = await res.json();
      setData(json);
      setStatus('Prediction ready');
    } catch(e){ setStatus('Prediction service offline or not configured'); }
    finally{ setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative">
      <Particles id="tsparticles-predict" init={particlesInit} options={particlesOptions} className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity:0, y:50 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500">AI Price Prediction</h1>
          <p className="text-gray-300 mt-3">Generate a price prediction powered by an external service.</p>
        </motion.div>

        <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Coin</label>
            <select value={coin} onChange={(e)=>setCoin(e.target.value)} className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg">
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
            </select>
          </div>
          <button onClick={fetchPrediction} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md py-2">Generate Prediction</button>
          {status && <p className="text-sm text-teal-400">{status}</p>}
        </div>

        {loading && <p className="text-center text-yellow-400 mt-6">Processing...</p>}

        {data && (
          <motion.div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-6" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <h2 className="text-xl font-bold text-teal-400 mb-2">Prediction Result</h2>
            <pre className="text-gray-300 text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
          </motion.div>
        )}
      </div>
    </div>
  );
}
