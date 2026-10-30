import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Layers, User, AlertCircle, ArrowRight } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    try {
      setLoading(true);
      setError('');
      const loggedUser = await demoLogin(role);
      if (loggedUser.role === 'admin') navigate('/admin');
      else if (loggedUser.role === 'organizer') navigate('/organizer');
      else navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Quick demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#F5F5F7]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#D2D2D7]/50">
        {/* NexEvent Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <BrandLogo size="lg" className="mb-3" />
          <h1 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
            Sign in to your account
          </h1>
          <p className="text-xs text-[#6E6E73] mt-1">
            Access your passes, event schedules, and personal account.
          </p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="mb-6 bg-[#F5F5F7] rounded-2xl p-3 border border-[#D2D2D7]/60">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6E6E73] text-center mb-2">
            Instant 1-Click Demo Evaluation
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-1 text-center bg-white rounded-xl text-[11px] font-semibold text-[#1D1D1F] border border-[#D2D2D7]/70 hover:bg-neutral-50 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('organizer')}
              className="py-2 px-1 text-center bg-white rounded-xl text-[11px] font-semibold text-[#1D1D1F] border border-[#D2D2D7]/70 hover:bg-neutral-50 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Organizer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="py-2 px-1 text-center bg-white rounded-xl text-[11px] font-semibold text-[#1D1D1F] border border-[#D2D2D7]/70 hover:bg-neutral-50 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-emerald-500" />
              <span>Attendee</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#F5F5F7] rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F5F5F7] rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full shadow-md transition-transform active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-[#D2D2D7]/50">
          <p className="text-xs text-[#6E6E73]">
            Don't have an Apple Event account?{' '}
            <Link to="/register" className="text-[#0071E3] font-semibold hover:underline">
              Create yours now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
