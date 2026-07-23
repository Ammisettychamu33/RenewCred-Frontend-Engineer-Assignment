import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiGrid,
  FiFileText,
  FiPlusSquare,
  FiSettings,
  FiExternalLink,
  FiZap,
} from 'react-icons/fi';

const Sidebar = () => {
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);

  const publicUrl = typeof window !== 'undefined' && (window.location.hostname.includes('github.io') || window.location.pathname.includes('/RenewCred-Frontend-Engineer-Assignment'))
    ? '../'
    : 'http://localhost:3001';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'All Pages', path: '/pages', icon: FiFileText },
    { name: 'Create Page', path: '/pages/new', icon: FiPlusSquare },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 bg-slate-900 text-slate-300 w-64 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
      } transition-all duration-300 ease-in-out flex flex-col border-r border-slate-800 shadow-xl`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
            <FiZap className="w-5 h-5 fill-current" />
          </div>
          <span className={`font-bold text-lg text-white tracking-tight ${!isSidebarOpen ? 'lg:hidden' : ''}`}>
            RenewCred <span className="text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 ml-1">CMS</span>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={`${!isSidebarOpen ? 'lg:hidden' : ''}`}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Public Site Quick Link & User Info */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <a
          href={publicUrl}
          target={publicUrl.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors border border-slate-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
            !isSidebarOpen ? 'lg:justify-center' : ''
          }`}
        >
          <span className={`flex items-center gap-2 ${!isSidebarOpen ? 'lg:hidden' : ''}`}>
            <FiExternalLink className="w-4 h-4 text-brand-400" /> Public Website
          </span>
          <FiExternalLink className={`w-4 h-4 text-brand-400 ${isSidebarOpen ? 'lg:hidden' : ''}`} />
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
