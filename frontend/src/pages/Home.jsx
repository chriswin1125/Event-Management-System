import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { EventCardSkeleton } from '../components/LoadingSkeleton';
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Compass,
  ShieldCheck,
  QrCode,
  Zap,
  Sliders,
  Cpu,
  Music,
  Palette,
  Briefcase,
  Layers,
  Trophy,
  GraduationCap,
  Film,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

const categoryIcons = {
  Technology: Cpu,
  Music: Music,
  'Art & Culture': Palette,
  Business: Briefcase,
  Workshops: Layers,
  Sports: Trophy,
  Education: GraduationCap,
  Entertainment: Film,
};

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, upcRes, catRes] = await Promise.all([
          api.get('/events/featured'),
          api.get('/events?limit=6&sort=date'),
          api.get('/categories'),
        ]);

        setFeaturedEvents(featRes.data.data || []);
        setUpcomingEvents(upcRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollToContent = () => {
    const el = document.getElementById('featured-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white overflow-hidden w-full">
      {/* 1. HERO SECTION - 100% Viewport Height (Zero white gap at the bottom) */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#000000] text-white px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
        {/* Background Visual with Apple dark overlay */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2400&auto=format&fit=crop&q=85"
            alt="Event Atmosphere"
            className="w-full h-full object-cover opacity-50 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70"></div>
          {/* Subtle Radial Apple Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[#0071E3]/25 rounded-full blur-[160px] pointer-events-none"></div>
        </div>

        {/* Hero Content - Zoomed-In & Bold Typography */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 bg-white/10 apple-blur border border-white/25 text-white/95 text-xs sm:text-sm font-semibold px-5 py-2 rounded-full shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#0071E3]" />
            <span>NexEvent • Connect • Engage • Experience</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Discover. Experience. Celebrate.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl text-neutral-200 max-w-3xl mx-auto font-normal leading-relaxed tracking-tight"
          >
            Find extraordinary events and create unforgettable memories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-base sm:text-lg px-9 py-4 rounded-full shadow-xl transition-transform active:scale-95"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/organizer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-base sm:text-lg px-9 py-4 rounded-full apple-blur border border-white/35 transition-colors"
            >
              <span>Host an Event</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator at the bottom of the hero */}
        <div className="relative z-10 pt-4 pb-2 text-center">
          <button
            onClick={scrollToContent}
            className="inline-flex flex-col items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="text-[11px] uppercase tracking-widest font-semibold">Explore Highlights</span>
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-[#0071E3]" />
          </button>
        </div>
      </section>

      {/* 2. FEATURED EVENTS SHOWCASE */}
      <section id="featured-section" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
              Curated Highlights
            </span>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1D1D1F]">
              Featured Events.
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-base font-semibold text-[#0071E3] hover:text-[#0077ED] group"
          >
            <span>See all featured</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredEvents.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 3. EXPLORE BY CATEGORIES */}
      <section className="py-28 sm:py-36 bg-[#F5F5F7] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
              Browse Collections
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
              Explore by Categories.
            </h2>
            <p className="text-[#6E6E73] mt-4 text-lg">
              Every passion. Every discipline. Thoughtfully organized for discovery.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((cat) => {
              const IconComponent = categoryIcons[cat.name] || Compass;
              return (
                <Link
                  key={cat._id}
                  to={`/events?category=${encodeURIComponent(cat.name)}`}
                  className="group bg-white rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-[#D2D2D7]/50"
                >
                  <div className="w-16 h-16 rounded-3xl bg-[#F5F5F7] group-hover:bg-[#0071E3] text-[#1D1D1F] group-hover:text-white flex items-center justify-center transition-colors mb-5 shadow-sm">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-sm text-[#6E6E73] mt-1.5 font-medium">
                    {cat.eventCount || 0} event{cat.eventCount === 1 ? '' : 's'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. UPCOMING EVENTS */}
      <section className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
              What's Next
            </span>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1D1D1F]">
              Upcoming Events.
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-base font-semibold text-[#0071E3] hover:text-[#0077ED] group"
          >
            <span>Browse calendar</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE US - Apple Editorial Layout */}
      <section className="py-28 sm:py-36 bg-[#F5F5F7] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
              Engineered for Excellence
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
              Why Choose NexEvent.
            </h2>
            <p className="text-[#6E6E73] mt-4 text-lg">
              The seamless intersection of state-of-the-art engineering and human-centered design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-10 border border-[#D2D2D7]/50 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mb-6">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">
                  Easy Event Discovery
                </h3>
                <p className="text-[#6E6E73] text-base leading-relaxed">
                  Intuitive search, smart filters, and category navigation make discovering your next keynote or symphony effortless.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-[#D2D2D7]/50 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">
                  Secure Booking & Checkout
                </h3>
                <p className="text-[#6E6E73] text-base leading-relaxed">
                  End-to-end encrypted transactions with instant seat validation and zero overbooking using atomic database guarantees.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-[#D2D2D7]/50 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">
                  Digital Tickets & Apple Wallet
                </h3>
                <p className="text-[#6E6E73] text-base leading-relaxed">
                  Instant tamper-proof digital passes with high-resolution QR codes accessible anytime from your personal dashboard.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-[#D2D2D7]/50 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">
                  Real-Time Updates
                </h3>
                <p className="text-[#6E6E73] text-base leading-relaxed">
                  Get notified the moment event schedules change, passes are confirmed, or new keynote speakers join the roster.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-[#1D1D1F] to-[#2D2D30] text-white rounded-3xl p-10 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 border border-white/20">
                  <Sliders className="w-7 h-7 text-[#0071E3]" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  Comprehensive Event Management
                </h3>
                <p className="text-neutral-300 text-base leading-relaxed max-w-2xl">
                  Empowering organizers with real-time attendee tracking, multi-tier pricing, interactive seat counters, and detailed box office analytics.
                </p>
              </div>
              <div className="mt-8 relative z-10">
                <Link
                  to="/organizer"
                  className="inline-flex items-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  <span>Open Organizer Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALLOUT BANNER - Host an event */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-[#1D1D1F] text-white rounded-3xl p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -bottom-24 -right-24 w-[450px] h-[450px] bg-[#0071E3]/30 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3]">
              Ready to Host?
            </span>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Bring your extraordinary event to life.
            </h2>
            <p className="text-neutral-300 text-lg leading-relaxed">
              Join visionary developers, curators, and creators. Publish your event on the world's most elegant platform.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/organizer/events/create"
                className="w-full sm:w-auto bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-base px-9 py-4 rounded-full transition-transform active:scale-95 shadow-lg"
              >
                Create an Event
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto text-white/90 hover:text-white text-base font-semibold px-8 py-4 transition-colors"
              >
                Talk to Sales & Support →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
