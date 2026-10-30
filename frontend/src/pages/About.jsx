import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart, Zap, Globe, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block">
          Our Philosophy
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1D1D1F] leading-tight">
          Where extraordinary moments are brought to life.
        </h1>
        <p className="text-lg sm:text-xl text-[#6E6E73] leading-relaxed max-w-2xl mx-auto">
          We believe technology is at its finest when it empowers people to congregate, learn, and experience wonder together in physical spaces.
        </p>
      </section>

      {/* Editorial Story Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1800&auto=format&fit=crop&q=85"
            alt="Event Hall"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Steve Jobs Theater Heritage</span>
            <h3 className="text-2xl font-bold mt-1">Designed for human resonance</h3>
          </div>
        </div>
      </div>

      {/* Pillars Grid */}
      <section className="bg-[#F5F5F7] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
              Principles that guide our engineering.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-[#D2D2D7]/50 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Purity of Design</h3>
              <p className="text-[#6E6E73] text-sm leading-relaxed">
                Zero visual clutter. No noisy ads or extraneous widgets. Every element exists with clear purpose and visual poise.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#D2D2D7]/50 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Privacy & Trust</h3>
              <p className="text-[#6E6E73] text-sm leading-relaxed">
                We never monetize your personal attendee behavior or track you across the web. Your ticket and data belong exclusively to you.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#D2D2D7]/50 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Uncompromising Performance</h3>
              <p className="text-[#6E6E73] text-sm leading-relaxed">
                Sub-second page speeds, instant seat locking with atomic concurrency, and offline-ready cryptographic QR verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-4xl sm:text-5xl font-bold text-[#1D1D1F] block">100k+</span>
            <span className="text-xs sm:text-sm text-[#6E6E73] mt-2 block font-medium">Global Attendees</span>
          </div>
          <div>
            <span className="text-4xl sm:text-5xl font-bold text-[#0071E3] block">99.98%</span>
            <span className="text-xs sm:text-sm text-[#6E6E73] mt-2 block font-medium">Uptime Reliability</span>
          </div>
          <div>
            <span className="text-4xl sm:text-5xl font-bold text-[#1D1D1F] block">4.9/5</span>
            <span className="text-xs sm:text-sm text-[#6E6E73] mt-2 block font-medium">Attendee Satisfaction</span>
          </div>
          <div>
            <span className="text-4xl sm:text-5xl font-bold text-[#1D1D1F] block">100%</span>
            <span className="text-xs sm:text-sm text-[#6E6E73] mt-2 block font-medium">Carbon Neutral Servers</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
