import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import TicketModal from '../../components/TicketModal';
import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBookingForPass, setSelectedBookingForPass] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Cancellation modal state
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      setCancelling(true);
      await api.patch(`/bookings/${bookingToCancel._id}/cancel`, {
        reason: cancelReason,
      });

      setCancelMessage(`Booking ${bookingToCancel.bookingId} cancelled. Refund initiated.`);
      setBookingToCancel(null);
      fetchBookings();
      setTimeout(() => setCancelMessage(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return b.status === 'confirmed';
    }
    return b.status === 'cancelled' || b.status === 'attended';
  });

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
          Apple Wallet & Passes
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
          My Bookings.
        </h1>
        <p className="text-[#6E6E73] text-base mt-2">
          Access your digital passes, view QR codes for gate check-in, and manage reservations.
        </p>
      </div>

      {cancelMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{cancelMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#D2D2D7]/60 mb-8 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 transition-colors ${
            activeTab === 'upcoming'
              ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          Active Passes ({bookings.filter((b) => b.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 transition-colors ${
            activeTab === 'past'
              ? 'text-[#0071E3] border-b-2 border-[#0071E3]'
              : 'text-[#6E6E73] hover:text-[#1D1D1F]'
          }`}
        >
          Cancelled & Past Passes ({bookings.filter((b) => b.status !== 'confirmed').length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#F5F5F7] rounded-3xl p-12 text-center max-w-xl mx-auto border border-[#D2D2D7]/50">
          <Ticket className="w-12 h-12 text-[#6E6E73] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">
            {activeTab === 'upcoming' ? 'No active passes found' : 'No past reservations'}
          </h3>
          <p className="text-xs text-[#6E6E73] mb-6 leading-relaxed">
            {activeTab === 'upcoming'
              ? "You haven't reserved tickets for any upcoming events yet."
              : 'Your cancelled or past events will appear here.'}
          </p>
          <Link to="/events" className="apple-btn-primary px-6 py-2.5 text-xs">
            Browse Events Directory
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => {
            const event = b.event || {};
            const eventDate = event.date
              ? new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'TBA';

            return (
              <div
                key={b._id}
                className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Event Thumbnail & Info */}
                <div className="flex items-start sm:items-center gap-5 flex-1">
                  <img
                    src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                    alt={event.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 border border-[#D2D2D7]"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-[#D2D2D7]/60 text-[#1D1D1F]">
                        {b.tierName}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] line-clamp-1">
                      {event.title || 'Event Details'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E6E73] mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{eventDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[200px]">{event.venueName}, {event.city}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs">
                      <span className="text-[#6E6E73]">Ref: </span>
                      <strong className="font-mono text-[#1D1D1F]">{b.bookingId}</strong>
                      <span className="mx-2 text-[#D2D2D7]">•</span>
                      <span className="text-[#1D1D1F] font-semibold">{b.quantity} Pass(es)</span>
                      <span className="mx-2 text-[#D2D2D7]">•</span>
                      <span className="text-[#0071E3] font-bold">₹{b.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-[#D2D2D7]/60">
                  <button
                    onClick={() => {
                      setSelectedBookingForPass(b);
                      setTicketModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-[#D2D2D7] rounded-full text-xs font-semibold shadow-xs transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-[#0071E3]" />
                    <span>View Digital Pass</span>
                  </button>

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => setBookingToCancel(b)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Modal */}
      {selectedBookingForPass && (
        <TicketModal
          isOpen={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          booking={selectedBookingForPass}
        />
      )}

      {/* Cancellation Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 apple-blur">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#D2D2D7]/50 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1D1D1F]">Cancel Reservation?</h3>
                <p className="text-xs text-[#6E6E73]">Pass ID: {bookingToCancel.bookingId}</p>
              </div>
            </div>

            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Are you sure you want to cancel your pass for <strong>{bookingToCancel.event?.title}</strong>? Your seat will be returned to the ticket pool and a full refund of ₹{bookingToCancel.totalAmount} will be processed.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#F5F5F7] rounded-xl p-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              >
                <option value="Schedule conflict">Schedule conflict</option>
                <option value="Travel changes">Travel changes</option>
                <option value="Booked by mistake">Booked by mistake</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
              <button
                onClick={() => setBookingToCancel(null)}
                className="px-5 py-2.5 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-xs font-semibold hover:bg-[#E8E8ED] transition-colors"
              >
                Keep Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
