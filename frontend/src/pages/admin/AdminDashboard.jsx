import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../../services/api';
import {
  Shield,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

const COLORS = ['#0071E3', '#1D1D1F', '#86868B', '#5856D6', '#34C759', '#FF9500'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pending Approvals
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectionModalEvent, setRejectionModalEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete event schedule or asset quality');

  // Users Tab
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Events Tab
  const [allEvents, setAllEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventSearch, setEventSearch] = useState('');

  // Bookings Tab
  const [allBookings, setAllBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data.stats);
      setPendingEvents(res.data.data.pendingEvents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await api.get(`/admin/users?search=${encodeURIComponent(userSearch)}`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      setEventsLoading(true);
      const res = await api.get(`/admin/events?search=${encodeURIComponent(eventSearch)}`);
      setAllEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await api.get('/admin/bookings');
      setAllBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Switch tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') fetchUsers();
    if (tab === 'events') fetchAllEvents();
    if (tab === 'bookings') fetchAllBookings();
  };

  // Event Approval
  const handleApprove = async (eventId) => {
    try {
      setApprovingId(eventId);
      await api.patch(`/admin/events/${eventId}/approve`, { action: 'approve' });
      setPendingEvents((prev) => prev.filter((e) => e._id !== eventId));
      fetchDashboardOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    } finally {
      setApprovingId(null);
    }
  };

  // Event Rejection
  const handleReject = async () => {
    if (!rejectionModalEvent) return;
    try {
      await api.patch(`/admin/events/${rejectionModalEvent._id}/approve`, {
        action: 'reject',
        rejectionReason,
      });
      setPendingEvents((prev) => prev.filter((e) => e._id !== rejectionModalEvent._id));
      setRejectionModalEvent(null);
      fetchDashboardOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  // Feature toggle
  const handleToggleFeature = async (eventId) => {
    try {
      const res = await api.patch(`/admin/events/${eventId}/feature`);
      const updated = res.data.data;
      setAllEvents((prev) => prev.map((e) => (e._id === eventId ? updated : e)));
    } catch (err) {
      console.error(err);
    }
  };

  // User role toggle
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${userId}`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data.data : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update user role');
    }
  };

  // User status toggle
  const handleToggleUserStatus = async (userId, currentActive) => {
    try {
      const res = await api.patch(`/admin/users/${userId}`, { isActive: !currentActive });
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data.data : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update user status');
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-red-600 block mb-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Admin Control Center
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
          Platform Governance.
        </h1>
        <p className="text-[#6E6E73] text-base mt-2">
          Review organizer submissions, monitor transaction revenues, and manage platform members.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D2D2D7]/60 mb-8 space-x-6 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => handleTabChange('overview')}
          className={`pb-3 transition-colors ${
            activeTab === 'overview'
              ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          Platform Overview
        </button>
        <button
          onClick={() => handleTabChange('approvals')}
          className={`pb-3 transition-colors flex items-center gap-1.5 ${
            activeTab === 'approvals'
              ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          <span>Pending Approvals</span>
          {pendingEvents.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {pendingEvents.length}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange('users')}
          className={`pb-3 transition-colors ${
            activeTab === 'users'
              ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          User Accounts
        </button>
        <button
          onClick={() => handleTabChange('events')}
          className={`pb-3 transition-colors ${
            activeTab === 'events'
              ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => handleTabChange('bookings')}
          className={`pb-3 transition-colors ${
            activeTab === 'bookings'
              ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          Transactions & Bookings
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-12">
          {/* 5 High-Level Platform KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#F5F5F7] rounded-3xl p-5 border border-[#D2D2D7]/50 shadow-sm">
              <span className="text-[11px] text-[#6E6E73] font-medium block">Total Attendees</span>
              <span className="text-2xl font-bold text-[#1D1D1F] mt-1 block">{stats?.totalUsers || 0}</span>
            </div>
            <div className="bg-[#F5F5F7] rounded-3xl p-5 border border-[#D2D2D7]/50 shadow-sm">
              <span className="text-[11px] text-[#6E6E73] font-medium block">Active Organizers</span>
              <span className="text-2xl font-bold text-[#1D1D1F] mt-1 block">{stats?.totalOrganizers || 0}</span>
            </div>
            <div className="bg-[#F5F5F7] rounded-3xl p-5 border border-[#D2D2D7]/50 shadow-sm">
              <span className="text-[11px] text-[#6E6E73] font-medium block">Platform Events</span>
              <span className="text-2xl font-bold text-[#1D1D1F] mt-1 block">{stats?.totalEvents || 0}</span>
            </div>
            <div className="bg-[#F5F5F7] rounded-3xl p-5 border border-[#D2D2D7]/50 shadow-sm">
              <span className="text-[11px] text-[#6E6E73] font-medium block">Total Bookings</span>
              <span className="text-2xl font-bold text-[#1D1D1F] mt-1 block">{stats?.totalBookings || 0}</span>
            </div>
            <div className="bg-[#F5F5F7] rounded-3xl p-5 border border-[#D2D2D7]/50 shadow-sm col-span-2 md:col-span-1">
              <span className="text-[11px] text-[#6E6E73] font-medium block">Gross Revenue</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                ₹{(stats?.totalRevenue || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pending Submissions Quick Action */}
          {pendingEvents.length > 0 && (
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-amber-900">
                    {pendingEvents.length} Event(s) Awaiting Review
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('approvals')}
                  className="text-xs font-semibold text-amber-900 hover:underline"
                >
                  Go to Approvals Queue →
                </button>
              </div>
              <p className="text-xs text-amber-800">
                Organizers have submitted new keynotes. Review agenda fidelity, venue integrity, and pricing before publishing to the marketplace.
              </p>
            </div>
          )}

          {/* Category Distribution Chart */}
          <div className="bg-[#F5F5F7] rounded-3xl p-8 border border-[#D2D2D7]/50 shadow-sm">
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-6">Platform Category Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Technology', count: 4 },
                    { name: 'Music', count: 2 },
                    { name: 'Art & Culture', count: 1 },
                    { name: 'Business', count: 1 },
                    { name: 'Workshops', count: 1 },
                    { name: 'Sports', count: 1 },
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6E6E73' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6E6E73' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1D1D1F',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="count" fill="#0071E3" radius={[8, 8, 0, 0]} name="Events Hosted" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1D1D1F]">
              Review Queue ({pendingEvents.length})
            </h3>
          </div>

          {pendingEvents.length === 0 ? (
            <div className="bg-[#F5F5F7] rounded-3xl p-12 text-center border border-[#D2D2D7]/50">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#1D1D1F]">All Submissions Reviewed</h3>
              <p className="text-xs text-[#6E6E73] mt-1">There are no pending events waiting for curation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((ev) => (
                <div
                  key={ev._id}
                  className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={ev.bannerImage}
                      alt={ev.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-[#D2D2D7]"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase bg-white px-2.5 py-0.5 rounded-full border border-[#D2D2D7]/60 text-[#1D1D1F]">
                          {ev.category}
                        </span>
                        <span className="text-xs text-[#6E6E73]">
                          Host: {ev.organizer?.name} ({ev.organizer?.organizationName || 'Organizer'})
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#1D1D1F]">{ev.title}</h4>
                      <p className="text-xs text-[#6E6E73] line-clamp-2 mt-1">{ev.shortDescription}</p>

                      <div className="text-[11px] text-[#6E6E73] mt-2">
                        <span>{ev.venueName}, {ev.city}</span> •{' '}
                        <span>{new Date(ev.date).toLocaleDateString()}</span> •{' '}
                        <span className="font-semibold text-[#1D1D1F]">
                          Tiers: {ev.ticketTiers?.map((t) => `${t.tierName} (₹${t.price})`).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-[#D2D2D7]/50">
                    <button
                      onClick={() => handleApprove(ev._id)}
                      disabled={approvingId === ev._id}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{approvingId === ev._id ? 'Approving...' : 'Approve & Publish'}</span>
                    </button>

                    <button
                      onClick={() => setRejectionModalEvent(ev)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#D2D2D7] text-red-600 hover:bg-red-50 rounded-full text-xs font-semibold shadow-xs transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-[#1D1D1F]">Registered Accounts ({users.length})</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                placeholder="Search name or email..."
                className="w-full bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D2D2D7]/60 text-[#6E6E73] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Joined</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2D2D7]/30">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/50">
                    <td className="py-3 px-3 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-semibold text-[#1D1D1F] block">{u.name}</span>
                        <span className="text-[11px] text-[#6E6E73]">{u.email}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                        className="bg-white border border-[#D2D2D7]/70 rounded-lg px-2 py-1 text-xs text-[#1D1D1F] focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          u.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.isActive !== false ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[#6E6E73]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.isActive !== false)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                          u.isActive !== false
                            ? 'text-red-600 border-red-200 hover:bg-red-50'
                            : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {u.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ALL EVENTS */}
      {activeTab === 'events' && (
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-[#1D1D1F]">Platform Events ({allEvents.length})</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAllEvents()}
                placeholder="Search event title..."
                className="w-full bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D2D2D7]/60 text-[#6E6E73] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3">Event</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2D2D7]/30">
                {allEvents.map((ev) => (
                  <tr key={ev._id} className="hover:bg-white/50">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#1D1D1F] block">{ev.title}</span>
                      <span className="text-[11px] text-[#6E6E73]">{ev.city} • {new Date(ev.date).toLocaleDateString()}</span>
                    </td>

                    <td className="py-3 px-3 text-[#6E6E73]">{ev.category}</td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          ev.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ev.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleFeature(ev._id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          ev.isFeatured ? 'text-amber-500 hover:text-amber-600' : 'text-neutral-300 hover:text-neutral-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${ev.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <a
                        href={`/events/${ev.slug || ev._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#0071E3] hover:underline"
                      >
                        View Page
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-[#1D1D1F]">Platform Transactions ({allBookings.length})</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D2D2D7]/60 text-[#6E6E73] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3">Ref ID</th>
                  <th className="py-3 px-3">Attendee</th>
                  <th className="py-3 px-3">Event</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2D2D7]/30">
                {allBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/50">
                    <td className="py-3 px-3 font-mono font-bold text-[#1D1D1F]">{b.bookingId}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#1D1D1F] block">{b.user?.name}</span>
                      <span className="text-[10px] text-[#6E6E73]">{b.user?.email}</span>
                    </td>
                    <td className="py-3 px-3 text-[#1D1D1F] font-medium">{b.event?.title}</td>
                    <td className="py-3 px-3 text-[#6E6E73]">{b.quantity}x {b.tierName}</td>
                    <td className="py-3 px-3 font-bold text-[#0071E3]">₹{b.totalAmount?.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 apple-blur">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#D2D2D7]/50 space-y-4">
            <h3 className="font-bold text-lg text-[#1D1D1F]">Reject Event Submission</h3>
            <p className="text-xs text-[#6E6E73]">
              Provide feedback for "{rejectionModalEvent.title}". The organizer will be notified immediately.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Feedback Reason</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-[#F5F5F7] rounded-xl p-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setRejectionModalEvent(null)}
                className="px-5 py-2.5 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-xs font-semibold hover:bg-[#E8E8ED] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
