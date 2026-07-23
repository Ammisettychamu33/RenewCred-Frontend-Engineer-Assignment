import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginAdminThunk, clearAuthError } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { FiZap, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'admin@renewcred.com',
      password: 'Admin@123456',
    },
  });

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(loginAdminThunk(data));
    if (loginAdminThunk.fulfilled.match(result)) {
      dispatch(
        addToast({
          type: 'success',
          message: `Welcome back, ${result.payload.user.name}!`,
        })
      );
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Subtle Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-850/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-brand-500/30">
            <FiZap className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">RenewCred Admin CMS</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in with administrator credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Demo Credentials Box */}
        <div className="mb-6 p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-300 flex flex-col gap-1">
          <span className="font-semibold text-brand-400 uppercase tracking-wider">Demo Credentials</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Email:</span>
            <span className="font-mono text-slate-200">admin@renewcred.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Password:</span>
            <span className="font-mono text-slate-200">Admin@123456</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="admin@renewcred.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder:text-slate-500"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder:text-slate-500"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Dashboard <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
