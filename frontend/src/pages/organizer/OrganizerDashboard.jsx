import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import api from '../../services/api';
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Attendees modal
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const fetchOrganizerData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes] = await Promise.all([
        api.get('/events/organizer/stats'),
        api.get('/events/organizer/my-events'),
      ]);
      setStats(statsRes.data.data);
      setMyEvents(eventsRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/events/${id}`);
      setMyEvents((prev) => prev.filter((e) => e._id !== id));
      fetchOrganizerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete event');
    }
  };

  const handleViewAttendees = async (eventId, title) => {
    setSelectedEventTitle(title);
    setAttendeeModalOpen(true);
    setAttendeesLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/attendees`);
      setSelectedEventAttendees(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAttendeesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
            Organizer Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Box Office Analytics.
          </h1>
          <p className="text-[#6E6E73] text-base mt-2">
            Monitor real-time ticket sales, registrations, and manage your events.
          </p>
        </div>

        <Link
          to="/organizer/events/create"
          className="inline-flex items-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold px-6 py-3 rounded-full shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Event</span>
        </Link>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#1D1D1F] flex items-center justify-center mb-4 shadow-xs">
            <Calendar className="w-5 h-5 text-[#0071E3]" />
          </div>
          <span className="text-xs font-medium text-[#6E6E73]">Total Events Hosted</span>
          <h3 className="text-3xl font-bold text-[#1D1D1F] mt-1">{stats?.totalEvents || 0}</h3>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 block">
            {stats?.totalApproved || 0} live on marketplace
          </span>
        </div>

        <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#1D1D1F] flex items-center justify-center mb-4 shadow-xs">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-xs font-medium text-[#6E6E73]">Total Passes Sold</span>
          <h3 className="text-3xl font-bold text-[#1D1D1F] mt-1">{stats?.totalTicketsSold || 0}</h3>
          <span className="text-[11px] text-[#6E6E73] mt-2 block">Across all ticket tiers</span>
        </div>

        <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#1D1D1F] flex items-center justify-center mb-4 shadow-xs">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-[#6E6E73]">Total Gross Revenue</span>
          <h3 className="text-3xl font-bold text-[#1D1D1F] mt-1">₹{(stats?.totalRevenue || 0).toLocaleString()}</h3>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 block">Direct box office earnings</span>
        </div>

        <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#1D1D1F] flex items-center justify-center mb-4 shadow-xs">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-xs font-medium text-[#6E6E73]">Pending Curation</span>
          <h3 className="text-3xl font-bold text-[#1D1D1F] mt-1">{stats?.totalPending || 0}</h3>
          <span className="text-[11px] text-amber-600 font-medium mt-2 block">Under admin review</span>
        </div>
      </div>

      {/* Recharts Analytics Bar */}
      {stats?.eventPerformance && stats.eventPerformance.length > 0 && (
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm mb-12">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#1D1D1F]">Ticket Sales by Event</h3>
            <p className="text-xs text-[#6E6E73]">Breakdown of confirmed ticket volume</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.eventPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                />
                <Bar dataKey="ticketsSold" fill="#0071E3" radius={[8, 8, 0, 0]} name="Tickets Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1D1D1F]">Managed Events ({myEvents.length})</h3>
        </div>

        {myEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs text-[#6E6E73] mb-4">You have not created any events yet.</p>
            <Link to="/organizer/events/create" className="apple-btn-primary px-5 py-2 text-xs">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D2D2D7]/60 text-[#6E6E73] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Date & City</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Passes Sold</th>
                  <th className="py-3 px-4">Revenue</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2D2D7]/40">
                {myEvents.map((ev) => (
                  <tr key={ev._id} className="hover:bg-white/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.bannerImage}
                          alt={ev.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#D2D2D7]"
                        />
                        <div>
                          <Link
                            to={`/events/${ev.slug || ev._id}`}
                            className="font-semibold text-sm text-[#1D1D1F] hover:text-[#0071E3] line-clamp-1"
                          >
                            {ev.title}
                          </Link>
                          <span className="text-[10px] text-[#6E6E73]">{ev.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#6E6E73]">
                      <div>{new Date(ev.date).toLocaleDateString()}</div>
                      <div className="text-[10px]">{ev.city}</div>
                    </td>

                    <td className="py-4 px-4">
                      {ev.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Live
                        </span>
                      )}
                      {ev.status === 'pending_approval' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Under Review
                        </span>
                      )}
                      {ev.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#1D1D1F]">
                      {ev.totalTicketsSold || 0}
                    </td>

                    <td className="py-4 px-4 font-bold text-[#0071E3]">
                      ₹{(ev.revenue || 0).toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleViewAttendees(ev._id, ev.title)}
                          className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#0071E3] hover:bg-white transition-colors"
                          title="View Registered Attendees"
                        >
                          <Users className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(ev._id, ev.title)}
                          className="p-1.5 rounded-lg text-[#6E6E73] hover:text-red-600 hover:bg-white transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendees Modal */}
      {attendeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 apple-blur overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#D2D2D7]/50 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#D2D2D7]/50 pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">Attendee Register</h3>
                <p className="text-xs text-[#6E6E73] truncate max-w-md">{selectedEventTitle}</p>
              </div>
              <button
                onClick={() => setAttendeeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-xs font-bold text-[#6E6E73] hover:text-[#1D1D1F]"
              >
                ✕
              </button>
            </div>

            {attendeesLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : selectedEventAttendees.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#6E6E73]">No attendees have reserved tickets yet.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto divide-y divide-[#D2D2D7]/30">
                {selectedEventAttendees.map((b) => (
                  <div key={b._id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={b.user?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-semibold text-[#1D1D1F] block">{b.user?.name}</span>
                        <span className="text-[10px] text-[#6E6E73] block">{b.user?.email}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-[#0071E3] block">{b.quantity}x {b.tierName}</span>
                      <span className="font-mono text-[10px] text-[#6E6E73]">{b.bookingId}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-[#D2D2D7]/50 text-right">
              <button
                onClick={() => setAttendeeModalOpen(false)}
                className="apple-btn-secondary px-5 py-2 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
