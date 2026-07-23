import React from 'react';
import { FiZap } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
            <FiZap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">RenewCred Platform</span>
        </div>

        <div className="text-xs text-slate-500 text-center sm:text-right">
          <p>© 2026 RenewCred Assignment. Zero hardcoded content architecture.</p>
          <p className="mt-1 text-slate-600">Built with Express, MongoDB, React, Redux Toolkit & KaTeX.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
