import React from 'react';
import { useSelector } from 'react-redux';
import { FiServer, FiShield, FiUserCheck } from 'react-icons/fi';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-slate-500 text-xs mt-1">Platform parameters, REST API endpoints, and administrator profile</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {/* Profile Info */}
        <div className="p-6 flex items-start gap-4">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100">
            <FiUserCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">Administrator Profile</h2>
            <p className="text-xs text-slate-400 mb-4">Currently authenticated session user details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Name</span>
                <span className="font-semibold text-slate-800 text-sm">{user?.name || 'Administrator'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Email</span>
                <span className="font-semibold text-slate-800 text-sm">{user?.email || 'admin@renewcred.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* API Server Endpoint Config */}
        <div className="p-6 flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <FiServer className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">API Connection Endpoint</h2>
            <p className="text-xs text-slate-400 mb-4">Backend Express API service URL configuration</p>
            <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs border border-slate-800">
              VITE_API_URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="p-6 flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <FiShield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">Security Assertions</h2>
            <p className="text-xs text-slate-400 mb-2">JWT Authentication, Bcrypt Hashing, Cors, Helmet</p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Token Expiration: 24 Hours</li>
              <li>Password Hash Salt Rounds: 10</li>
              <li>Rate Limit: 300 requests per 15 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
