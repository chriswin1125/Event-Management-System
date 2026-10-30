import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const Footer = () => {
  return (
    <footer className="bg-[#F5F5F7] text-[#6E6E73] text-xs pt-12 pb-8 border-t border-[#D2D2D7]/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header */}
        <div className="pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D2D2D7]/50">
          <BrandLogo size="md" showTagline={true} />
          <p className="text-[11px] text-[#86868B]">
            Premium Event & Keynote Experience Platform
          </p>
        </div>

        {/* Footnote / Disclaimer */}
        <div className="py-6 border-b border-[#D2D2D7]/50 text-[11px] leading-relaxed">
          <p>
            1. All tickets booked through NexEvent are verified with unique digital passes and instant QR credentials. Event admission subject to organizer terms.
          </p>
          <p className="mt-1">
            2. Spatial Audio and 4K Vision streams require compatible hardware. Apple-inspired design language reference implementation for educational & showcase purposes.
          </p>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-8 border-b border-[#D2D2D7]/50 text-[11px]">
          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">Explore Events</h4>
            <ul className="space-y-2">
              <li><Link to="/events?category=Technology" className="hover:text-[#1D1D1F] transition-colors">Keynotes & Tech</Link></li>
              <li><Link to="/events?category=Music" className="hover:text-[#1D1D1F] transition-colors">Spatial Audio & Music</Link></li>
              <li><Link to="/events?category=Art%20%26%20Culture" className="hover:text-[#1D1D1F] transition-colors">Design & Architecture</Link></li>
              <li><Link to="/events?category=Business" className="hover:text-[#1D1D1F] transition-colors">Executive Forums</Link></li>
              <li><Link to="/events?category=Workshops" className="hover:text-[#1D1D1F] transition-colors">Developer Workshops</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">Account & Passes</h4>
            <ul className="space-y-2">
              <li><Link to="/user/dashboard" className="hover:text-[#1D1D1F] transition-colors">Manage Apple ID</Link></li>
              <li><Link to="/user/bookings" className="hover:text-[#1D1D1F] transition-colors">Digital Passes & Wallet</Link></li>
              <li><Link to="/user/bookings" className="hover:text-[#1D1D1F] transition-colors">Refund Policies</Link></li>
              <li><Link to="/user/dashboard" className="hover:text-[#1D1D1F] transition-colors">Security & 2FA</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">Organizers</h4>
            <ul className="space-y-2">
              <li><Link to="/organizer" className="hover:text-[#1D1D1F] transition-colors">Host an Event</Link></li>
              <li><Link to="/organizer/events/create" className="hover:text-[#1D1D1F] transition-colors">Submit Keynote</Link></li>
              <li><Link to="/organizer" className="hover:text-[#1D1D1F] transition-colors">Box Office Analytics</Link></li>
              <li><Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">Partner Inquiries</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">About NexEvent</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-[#1D1D1F] transition-colors">Our Design Philosophy</Link></li>
              <li><Link to="/about" className="hover:text-[#1D1D1F] transition-colors">Environmental Impact</Link></li>
              <li><Link to="/about" className="hover:text-[#1D1D1F] transition-colors">Ethics & Privacy</Link></li>
              <li><Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">Press & Media</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1D1D1F] mb-3">Assistance & Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">Contact Genius Support</Link></li>
              <li><Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">Accessibility Options</Link></li>
              <li><Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">Event Day FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">Check-in Instructions</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] gap-4">
          <p>
            Copyright © {new Date().getFullYear()} NexEvent Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/about" className="hover:text-[#1D1D1F] transition-colors">Privacy Policy</Link>
            <span className="text-[#D2D2D7]">|</span>
            <Link to="/about" className="hover:text-[#1D1D1F] transition-colors">Terms of Use</Link>
            <span className="text-[#D2D2D7]">|</span>
            <Link to="/about" className="hover:text-[#1D1D1F] transition-colors">Sales Policy</Link>
            <span className="text-[#D2D2D7]">|</span>
            <Link to="/about" className="hover:text-[#1D1D1F] transition-colors">Legal</Link>
            <span className="text-[#D2D2D7]">|</span>
            <Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
