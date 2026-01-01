import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-3">404</h1>
        <p className="text-gray-400 mb-6">The page you are looking for doesn’t exist.</p>
        <Link to="/" className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 text-white px-5 py-2 rounded-lg">Go Home</Link>
      </div>
    </div>
  );
}
