import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store/slices/uiSlice';
import { logoutAdminThunk } from '../store/slices/authSlice';
import { setSearchTerm } from '../store/slices/pageSlice';
import { FiMenu, FiSearch, FiLogOut, FiUser } from 'react-icons/fi';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { searchTerm } = useSelector((state) => state.pages);

  const handleLogout = () => {
    dispatch(logoutAdminThunk());
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          title="Toggle Navigation"
          aria-label="Toggle navigation sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-xs hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search pages or slugs..."
            className="pl-9 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin Profile dropdown / avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-slate-800">{user?.name || 'Admin User'}</div>
            <div className="text-xs text-slate-400 capitalize">{user?.role || 'Superadmin'}</div>
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            title="Logout"
            aria-label="Log out of admin session"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
