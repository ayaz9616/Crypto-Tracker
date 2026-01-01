import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useLocation } from 'react-router-dom';

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Header />
      <main className={isHome ? 'w-full px-0 py-0' : 'mx-auto max-w-7xl w-full px-4 py-6'}>{children}</main>
      <Footer />
    </div>
  );
}
