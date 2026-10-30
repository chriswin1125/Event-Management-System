import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    organizationName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const newUser = await register(formData);
      if (newUser.role === 'organizer') {
        navigate('/organizer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-[#F5F5F7]">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#D2D2D7]/50">
        <div className="text-center mb-8 flex flex-col items-center">
          <BrandLogo size="lg" className="mb-3" />
          <h1 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
            Create your account
          </h1>
          <p className="text-xs text-[#6E6E73] mt-1">
            One account for all your keynotes, summits, passes, and events.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">I want to:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`py-3 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'user'
                    ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-sm'
                    : 'bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7]/70 hover:bg-neutral-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Attend Events</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'organizer' })}
                className={`py-3 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'organizer'
                    ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-sm'
                    : 'bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7]/70 hover:bg-neutral-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Host Events</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Alex Morgan"
              className="w-full bg-[#F5F5F7] rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex.morgan@example.com"
              className="w-full bg-[#F5F5F7] rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full bg-[#F5F5F7] rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          {formData.role === 'organizer' && (
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Organization / Brand Name</label>
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="Cupertino Events Studio"
                className="w-full bg-[#F5F5F7] rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
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
                <span>Agree & Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-[#D2D2D7]/50">
          <p className="text-xs text-[#6E6E73]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0071E3] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
