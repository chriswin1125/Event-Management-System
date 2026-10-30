import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Calendar, Shield, Edit3, CheckCircle2, Ticket } from 'lucide-react';

const UserDashboard = () => {
  const { user, updateProfile, notifications } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(formData);
      setSuccess('Profile updated successfully.');
      setEditing(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
          Apple ID Profile
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
          Account & Preferences.
        </h1>
        <p className="text-[#6E6E73] text-base mt-2">
          Manage your personal credentials, digital passes, and event communications.
        </p>
      </div>

      {success && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#F5F5F7] rounded-3xl p-8 border border-[#D2D2D7]/50 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-white shadow-md"
              />
              <span className="absolute bottom-0 right-0 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white"></span>
            </div>

            <h2 className="text-xl font-bold text-[#1D1D1F]">{user?.name}</h2>
            <p className="text-xs text-[#6E6E73] mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-white text-[#1D1D1F] rounded-full border border-[#D2D2D7]/60">
              {user?.role}
            </span>

            {user?.bio && (
              <p className="text-xs text-[#6E6E73] mt-4 leading-relaxed italic">
                "{user.bio}"
              </p>
            )}

            <div className="mt-8 pt-6 border-t border-[#D2D2D7]/50 flex flex-col gap-3">
              <button
                onClick={() => setEditing(!editing)}
                className="w-full py-2.5 bg-white text-[#1D1D1F] hover:bg-neutral-50 border border-[#D2D2D7] rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editing ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>

              <Link
                to="/user/bookings"
                className="w-full py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>View My Passes</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Account Details & Edit Form */}
        <div className="lg:col-span-2">
          {editing ? (
            <div className="bg-[#F5F5F7] rounded-3xl p-8 border border-[#D2D2D7]/50 shadow-sm">
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-6">Edit Personal Information</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Short Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-white rounded-xl p-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  ></textarea>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full shadow-sm transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-2.5 bg-white border border-[#D2D2D7] text-[#1D1D1F] text-xs font-semibold rounded-full hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Account Overview Cards */}
              <div className="bg-[#F5F5F7] rounded-3xl p-8 border border-[#D2D2D7]/50 shadow-sm">
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-6">Security & Contact Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-2xl border border-[#D2D2D7]/50">
                    <span className="text-[#6E6E73] block mb-1">Primary Email</span>
                    <span className="font-semibold text-[#1D1D1F]">{user?.email}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#D2D2D7]/50">
                    <span className="text-[#6E6E73] block mb-1">Phone Number</span>
                    <span className="font-semibold text-[#1D1D1F]">{user?.phone || 'Not configured'}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#D2D2D7]/50">
                    <span className="text-[#6E6E73] block mb-1">Account Role</span>
                    <span className="font-semibold text-[#1D1D1F] capitalize">{user?.role}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#D2D2D7]/50">
                    <span className="text-[#6E6E73] block mb-1">Member Since</span>
                    <span className="font-semibold text-[#1D1D1F]">
                      {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification Activity */}
              <div className="bg-[#F5F5F7] rounded-3xl p-8 border border-[#D2D2D7]/50 shadow-sm">
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-4">Recent Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#6E6E73]">No recent notifications.</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 4).map((n) => (
                      <div key={n._id} className="bg-white p-4 rounded-2xl border border-[#D2D2D7]/40 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[#1D1D1F]">{n.title}</span>
                          <span className="text-[10px] text-[#86868B]">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[#6E6E73] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
