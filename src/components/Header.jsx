import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBitcoin, FaBell, FaChartLine, FaCoins } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineCalculator, AiOutlineCalendar, AiOutlineSetting } from 'react-icons/ai';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // simple scroll effect
  if (typeof window !== 'undefined') {
    window.onscroll = () => setScrolled(window.scrollY > 20);
  }

  const navItems = [
    { name: 'Home', path: '/', icon: <AiOutlineHome className="text-lg" /> },
    {
      name: 'Markets',
      icon: <FaChartLine className="text-lg" />,
      dropdown: [
        { name: 'Overview', path: '/overview', icon: <FaChartLine /> },
        { name: 'Portfolio', path: '/portfolio', icon: <FaCoins /> },
        { name: 'Converter', path: '/converter', icon: <AiOutlineCalculator /> },
        { name: 'Compare', path: '/compare', icon: <FaChartLine /> },
        { name: 'Historical', path: '/historical-chart', icon: <FaChartLine /> },
        { name: 'Predictions', path: '/predict', icon: <AiOutlineSetting /> },
      ],
    },
    {
      name: 'Tools',
      icon: <AiOutlineCalculator className="text-lg" />,
      dropdown: [
        { name: 'Wallet', path: '/wallet', icon: <AiOutlineSetting /> },
        { name: 'Buy', path: '/trade/buy', icon: <AiOutlineCalendar /> },
        { name: 'Sell', path: '/trade/sell', icon: <AiOutlineCalendar /> },
      ],
    },
    { name: 'Notifications', path: '/notifications', icon: <FaBell className="text-lg" /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700/50' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
        }`}
      >
        <div className="w-full mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group z-50">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-teal-400 to-blue-500 p-2 md:p-2.5 rounded-lg">
                  <FaBitcoin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight">Crypto Sim</span>
                <span className="text-xs text-teal-400 font-medium hidden sm:block">Trade & Track</span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-800/50">
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                      <FiChevronDown className={`text-sm transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
                        >
                          {item.dropdown.map((dropItem) => (
                            <Link
                              key={dropItem.path}
                              to={dropItem.path}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 group/item"
                            >
                              <span className="text-teal-400 group-hover/item:text-teal-300 transition-colors">{dropItem.icon}</span>
                              <span className="font-medium">{dropItem.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === item.path ? 'text-white bg-teal-500/20 border border-teal-500/50' : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center space-x-3 md:space-x-4 z-50">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    aria-label="Profile"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-lg border border-white/10"
                  >
                    {String(user?.username || 'U').charAt(0).toUpperCase()}
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                className="xl:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                onClick={() => setMenuOpen((p) => !p)}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 md:top-20 left-0 right-0 z-50 xl:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-2xl">
                <div className="mx-auto px-4 py-6 space-y-2">
                  {navItems.map((item) => (
                    item.dropdown ? (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center space-x-2 px-4 py-2 text-teal-400 font-semibold text-sm uppercase tracking-wide">
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                        {item.dropdown.map((dropItem) => (
                          <Link
                            key={dropItem.path}
                            to={dropItem.path}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                              location.pathname === dropItem.path ? 'text-white bg-teal-500/20 border border-teal-500/50' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            <span className="text-teal-400">{dropItem.icon}</span>
                            <span className="font-medium">{dropItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          location.pathname === item.path ? 'text-white bg-teal-500/20 border border-teal-500/50' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )
                  ))}

                  {!user && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-lg"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-lg"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
