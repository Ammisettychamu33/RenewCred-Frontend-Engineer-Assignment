import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="py-20 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <FiAlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-500 text-sm mt-2 mb-6">
        The requested URL was not found on this server.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <FiArrowLeft className="w-4 h-4" /> Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
