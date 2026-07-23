import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-100 selection:text-brand-700">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 md:py-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
