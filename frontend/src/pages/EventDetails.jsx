import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import TicketModal from '../components/TicketModal';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  CheckCircle2,
  AlertCircle,
  Share2,
  Heart,
  ChevronRight,
  Sparkles,
  Ticket,
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Flow States
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/events/${id}`);
        const eventData = res.data.data;
        setEvent(eventData);
        setRelated(res.data.related || []);

        if (eventData.ticketTiers && eventData.ticketTiers.length > 0) {
          // Select first available tier by default
          const available = eventData.ticketTiers.find((t) => t.availableSeats > 0) || eventData.ticketTiers[0];
          setSelectedTier(available);
        }

        // Fetch reviews
        try {
          const revRes = await api.get(`/reviews/${eventData._id}`);
          setReviews(revRes.data.data || []);
        } catch (revErr) {
          console.error(revErr);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Event could not be loaded');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
    window.scrollTo(0, 0);
  }, [id]);

  // Handle Ticket Booking
  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    if (!selectedTier) {
      setBookingError('Please choose a ticket tier');
      return;
    }

    if (selectedTier.availableSeats < quantity) {
      setBookingError(`Only ${selectedTier.availableSeats} seats available for this tier.`);
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError('');

      // Create booking via backend atomic seat validator
      const res = await api.post('/bookings', {
        eventId: event._id,
        tierName: selectedTier.tierName,
        quantity: Number(quantity),
        paymentMethod: 'Apple Pay / Razorpay (Verified Test Mode)',
        paymentId: `pay_test_${Date.now()}`,
      });

      const newBooking = res.data.data;
      setConfirmedBooking(newBooking);

      // Trigger Apple confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0071E3', '#000000', '#D2D2D7', '#6E6E73'],
        });
      } catch (cErr) {}

      // Update remaining seats in local state
      setEvent((prev) => ({
        ...prev,
        totalAvailableSeats: Math.max(0, prev.totalAvailableSeats - quantity),
        ticketTiers: prev.ticketTiers.map((t) =>
          t.tierName === selectedTier.tierName
            ? { ...t, availableSeats: Math.max(0, t.availableSeats - quantity) }
            : t
        ),
      }));

      // Open ticket modal
      setTicketModalOpen(true);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews', {
        eventId: event._id,
        rating: reviewRating,
        comment: reviewComment,
      });

      setReviews((prev) => [res.data.data, ...prev]);
      setReviewComment('');
      setReviewSuccess('Thank you! Your review has been published.');
      setTimeout(() => setReviewSuccess(''), 4000);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">{error || 'Event Not Found'}</h2>
        <p className="text-[#6E6E73] mb-6">The requested event may have expired or been removed.</p>
        <Link to="/events" className="apple-btn-primary px-6 py-2.5 text-xs">
          Browse All Events
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const subtotal = selectedTier ? selectedTier.price * quantity : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Cinematic Banner Hero */}
      <div className="relative h-[520px] sm:h-[620px] w-full bg-black overflow-hidden">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover opacity-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"></div>

        {/* Hero Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-14 text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 apple-blur border border-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <span>{event.category}</span>
            {event.isFeatured && <span>• Featured</span>}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-neutral-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0071E3]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0071E3]" />
              <span>{event.startTime} – {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0071E3]" />
              <span>{event.venueName}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content & Booking Column */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details, Description, Organizer, Reviews */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview / Pitch */}
            <div className="border-b border-[#D2D2D7]/50 pb-8">
              <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight mb-4">
                About this Experience
              </h2>
              <p className="text-lg text-[#1D1D1F] font-medium leading-relaxed mb-6">
                {event.shortDescription}
              </p>
              <div className="text-sm text-[#6E6E73] leading-relaxed whitespace-pre-line space-y-4">
                {event.description}
              </div>
            </div>

            {/* Venue & Location Card */}
            <div className="border-b border-[#D2D2D7]/50 pb-8">
              <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight mb-4">
                Venue & Location
              </h2>
              <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-base text-[#1D1D1F]">{event.venueName}</h3>
                  <p className="text-xs text-[#6E6E73] mt-1">{event.address}, {event.city}, {event.state} {event.country}</p>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${event.venueName} ${event.address} ${event.city}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="apple-btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Open in Apple Maps</span>
                </a>
              </div>
            </div>

            {/* Organizer Card */}
            {event.organizer && (
              <div className="border-b border-[#D2D2D7]/50 pb-8">
                <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight mb-4">
                  Curator & Host
                </h2>
                <div className="flex items-center gap-4 bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50">
                  <img
                    src={event.organizer.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                    alt={event.organizer.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#D2D2D7]"
                  />
                  <div>
                    <h3 className="font-semibold text-base text-[#1D1D1F]">{event.organizer.name}</h3>
                    <p className="text-xs text-[#0071E3] font-medium">{event.organizer.organizationName || 'Event Host'}</p>
                    <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2">{event.organizer.bio || 'Curating memorable gatherings worldwide.'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Attendee Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                    Attendee Reviews ({reviews.length})
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#1D1D1F]">{event.ratingsAverage || 5.0} out of 5</span>
                  </div>
                </div>
              </div>

              {/* Leave Review Form */}
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="bg-[#F5F5F7] rounded-3xl p-6 mb-8 border border-[#D2D2D7]/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] mb-3">Leave a Review</h3>
                  
                  {reviewSuccess && (
                    <div className="mb-3 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{reviewSuccess}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-[#6E6E73]">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`w-6 h-6 flex items-center justify-center transition-colors ${
                            star <= reviewRating ? 'text-amber-500' : 'text-neutral-300'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience at this keynote or event..."
                    className="w-full bg-white rounded-2xl p-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3] mb-3"
                    required
                  ></textarea>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="apple-btn-primary text-xs px-5 py-2 shadow-sm"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-[#F5F5F7] rounded-3xl p-6 text-center text-xs text-[#6E6E73] mb-8">
                  <Link to="/login" className="text-[#0071E3] font-semibold hover:underline">
                    Log in
                  </Link>{' '}
                  to share your review for this event.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="bg-white rounded-2xl p-5 border border-[#D2D2D7]/50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={rev.user?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-[#1D1D1F]">{rev.user?.name || 'Verified Attendee'}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#6E6E73] leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-[#86868B] mt-2 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Category Picker & Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/60 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-[#D2D2D7]/50 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#6E6E73] font-semibold block">
                    Starting from
                  </span>
                  <span className="text-2xl font-bold text-[#1D1D1F]">
                    ₹{(selectedTier ? selectedTier.price : event.lowestPrice).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Seats
                  </span>
                  <span className="text-[11px] text-[#6E6E73]">
                    {event.totalAvailableSeats} remaining
                  </span>
                </div>
              </div>

              {/* Select Ticket Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1D1D1F] mb-3">
                  Select Pass Tier
                </label>
                <div className="space-y-3">
                  {event.ticketTiers.map((tier) => {
                    const isSelected = selectedTier?.tierName === tier.tierName;
                    const isSoldOut = tier.availableSeats <= 0;

                    return (
                      <div
                        key={tier.tierName}
                        onClick={() => !isSoldOut && setSelectedTier(tier)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#0071E3] shadow-md ring-1 ring-[#0071E3]'
                            : isSoldOut
                            ? 'bg-neutral-100 border-[#D2D2D7]/50 opacity-50 cursor-not-allowed'
                            : 'bg-white border-[#D2D2D7]/60 hover:border-[#1D1D1F]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-[#1D1D1F]">
                            {tier.tierName}
                          </span>
                          <span className="font-bold text-sm text-[#1D1D1F]">
                            ₹{tier.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E6E73] leading-relaxed mb-2">
                          {tier.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={isSoldOut ? 'text-red-500 font-bold' : 'text-emerald-600 font-medium'}>
                            {isSoldOut ? 'Sold Out' : `${tier.availableSeats} passes left`}
                          </span>
                          {tier.perks && tier.perks.length > 0 && (
                            <span className="text-[#0071E3]">
                              {tier.perks.length} exclusive perk{tier.perks.length === 1 ? '' : 's'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              {selectedTier && selectedTier.availableSeats > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1D1D1F] mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between bg-white rounded-2xl p-2 border border-[#D2D2D7]/70">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center font-bold text-sm hover:bg-[#E8E8ED] disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-[#1D1D1F]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedTier.availableSeats, Math.min(10, quantity + 1)))}
                      disabled={quantity >= selectedTier.availableSeats || quantity >= 10}
                      className="w-8 h-8 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center font-bold text-sm hover:bg-[#E8E8ED] disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing breakdown */}
              {selectedTier && (
                <div className="space-y-2 text-xs text-[#6E6E73] pt-2 border-t border-[#D2D2D7]/50">
                  <div className="flex justify-between">
                    <span>Pass ({quantity}x ₹{selectedTier.price.toLocaleString()}):</span>
                    <span className="text-[#1D1D1F] font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Processing (5%):</span>
                    <span className="text-[#1D1D1F] font-medium">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#D2D2D7]/50 font-bold text-sm text-[#1D1D1F]">
                    <span>Total Amount:</span>
                    <span className="text-[#0071E3]">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {bookingError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Booking CTA Button */}
              <button
                onClick={handleBooking}
                disabled={bookingLoading || !selectedTier || selectedTier.availableSeats <= 0}
                className="w-full py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-sm rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Confirm & Pay ₹{total.toLocaleString()}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#6E6E73] text-center leading-tight">
                Secure checkout. Full refund eligible up to 48 hours before commencement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Related Events Row */}
      {related.length > 0 && (
        <section className="py-20 bg-[#F5F5F7] px-4 sm:px-6 lg:px-8 border-t border-[#D2D2D7]/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mb-8">
              Similar Keynotes & Gatherings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rel) => (
                <EventCard key={rel._id} event={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Digital Ticket Modal */}
      {confirmedBooking && (
        <TicketModal
          isOpen={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          booking={confirmedBooking}
        />
      )}
    </div>
  );
};

export default EventDetails;
