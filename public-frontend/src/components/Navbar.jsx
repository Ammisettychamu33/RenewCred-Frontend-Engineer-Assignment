import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNavPagesThunk } from '../store/slices/pageSlice';
import { FiZap, FiMenu, FiX, FiExternalLink } from 'react-icons/fi';

const Navbar = () => {
  const dispatch = useDispatch();
  const { navPages } = useSelector((state) => state.publicPages);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminUrl = 'https://renewcred-admin-frontend.onrender.com';

  useEffect(() => {
    dispatch(getNavPagesThunk());
  }, [dispatch]);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <FiZap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            RenewCred <span className="text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 ml-1">Enterprise</span>
          </span>
        </Link>

        {/* Desktop Dynamic Navigation Items */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                isActive
                  ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`
            }
          >
            Home
          </NavLink>

          {navPages
            .filter((p) => p.slug !== 'home')
            .map((page) => (
              <NavLink
                key={page._id}
                to={`/${page.slug}`}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                {page.title}
              </NavLink>
            ))}
        </nav>

        {/* Right Admin CMS Link */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={adminUrl}
            target={adminUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            Admin CMS <FiExternalLink className="w-3.5 h-3.5 text-brand-400" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 space-y-2 animate-fade-in">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </NavLink>
          {navPages
            .filter((p) => p.slug !== 'home')
            .map((page) => (
              <NavLink
                key={page._id}
                to={`/${page.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                {page.title}
              </NavLink>
            ))}
          <a
            href={adminUrl}
            target={adminUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="block px-3 py-2 text-brand-400 text-sm font-semibold hover:bg-slate-800 rounded-xl"
          >
            Admin CMS Portal →
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
