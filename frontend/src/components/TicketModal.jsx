import React, { useRef } from 'react';
import { X, Download, Printer, CheckCircle, Calendar, MapPin, User, ShieldCheck } from 'lucide-react';

const TicketModal = ({ isOpen, onClose, booking }) => {
  const printRef = useRef(null);

  if (!isOpen || !booking) return null;

  const event = booking.event || {};
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 apple-blur overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D2D2D7]/50 bg-[#F5F5F7]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-[#1D1D1F] uppercase tracking-wider">
              Official Digital Pass
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Pass Body */}
        <div ref={printRef} className="p-8 print:p-0">
          {/* Apple Event Pass Card */}
          <div className="bg-[#1D1D1F] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0071E3]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                  Event Pass
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white mt-0.5 line-clamp-1">
                  {event.title || 'Special Event'}
                </h3>
              </div>
              <span className="bg-white/10 text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/20">
                {booking.tierName}
              </span>
            </div>

            {/* Event Meta Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 my-4 text-xs">
              <div>
                <span className="text-neutral-400 block mb-1">DATE & TIME</span>
                <span className="font-semibold text-white block">{formattedDate}</span>
                <span className="text-neutral-300 block">{event.startTime || 'TBA'}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">VENUE</span>
                <span className="font-semibold text-white block truncate">{event.venueName}</span>
                <span className="text-neutral-300 block">{event.city}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">ATTENDEE</span>
                <span className="font-semibold text-white block">{booking.user?.name || 'Guest'}</span>
                <span className="text-neutral-300 block text-[11px]">{booking.user?.email}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">BOOKING REF</span>
                <span className="font-mono font-bold text-[#0071E3] text-sm block">
                  {booking.bookingId}
                </span>
                <span className="text-emerald-400 text-[11px]">Qty: {booking.quantity} Pass(es)</span>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center pt-2 text-center">
              <div className="bg-white p-3 rounded-2xl shadow-inner mb-3">
                {booking.qrCodeDataUrl ? (
                  <img
                    src={booking.qrCodeDataUrl}
                    alt="Digital Pass QR"
                    className="w-40 h-40 object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center bg-neutral-100 text-[#6E6E73] text-xs">
                    Pass Validated
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Encrypted Pass • Present at Gate</span>
              </div>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="mt-6 bg-[#F5F5F7] rounded-2xl p-4 text-xs flex justify-between items-center text-[#6E6E73]">
            <div>
              <span>Status: </span>
              <strong className="text-emerald-600 uppercase font-semibold">{booking.status}</strong>
              <span className="mx-2">•</span>
              <span>Paid via {booking.paymentMethod}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#1D1D1F]">
                Total: ₹{booking.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-8 py-4 bg-[#F5F5F7] border-t border-[#D2D2D7]/50">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1D1D1F] bg-white border border-[#D2D2D7] rounded-full hover:bg-neutral-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-full transition-transform active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
