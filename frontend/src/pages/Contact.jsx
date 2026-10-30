import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How do I download or print my digital event pass?',
    a: 'Once your booking is confirmed, your pass is available immediately in your User Dashboard under "My Bookings". Simply click "View Ticket" to display the encrypted QR code or tap "Print Pass".',
  },
  {
    q: 'What is the refund and cancellation policy?',
    a: 'You can cancel any eligible booking up to 48 hours prior to the event commencement directly from your dashboard. Your seat will be returned to the inventory and the full amount refunded to your payment method.',
  },
  {
    q: 'How do organizers submit an event for listing?',
    a: 'Registered organizers can create and customize events from the Organizer Dashboard. Once submitted, our curation team reviews the submission within 24 hours to ensure high fidelity before going live.',
  },
  {
    q: 'Can I transfer my pass to someone else?',
    a: 'Yes, event passes are transferable. You can share your booking confirmation or pass PDF with the attendee. Each pass features a unique cryptographic QR code verified at check-in.',
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
          Concierge & Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
          We're here to assist you.
        </h1>
        <p className="text-[#6E6E73] text-base sm:text-lg mt-3 leading-relaxed">
          Questions regarding event passes, organizer partnerships, or technical inquiries? Connect with our dedicated support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Contact Form */}
        <div className="bg-[#F5F5F7] rounded-3xl p-8 sm:p-10 border border-[#D2D2D7]/50 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight mb-2">Send an Inquiry</h2>
          <p className="text-xs text-[#6E6E73] mb-6">Our average response time is under two hours.</p>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>Thank you for your message. A NexEvent concierge will reach out to you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Morgan"
                className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex.morgan@example.com"
                className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Pass upgrade, billing, or organizer question"
                className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">Your Message</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Provide details about your question..."
                className="w-full bg-white rounded-2xl p-4 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Inquiry</span>
            </button>
          </form>
        </div>

        {/* Support Channels & Address */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50">
              <Mail className="w-6 h-6 text-[#0071E3] mb-4" />
              <h3 className="font-bold text-sm text-[#1D1D1F] mb-1">Email Support</h3>
              <p className="text-xs text-[#6E6E73] mb-2">General inquiries and ticketing help.</p>
              <a href="mailto:support@eventhub.com" className="text-xs font-semibold text-[#0071E3] hover:underline">
                support@eventhub.com
              </a>
            </div>

            <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50">
              <Phone className="w-6 h-6 text-[#0071E3] mb-4" />
              <h3 className="font-bold text-sm text-[#1D1D1F] mb-1">Toll-Free Phone</h3>
              <p className="text-xs text-[#6E6E73] mb-2">Available 24 hours a day, 7 days a week.</p>
              <a href="tel:18006927753" className="text-xs font-semibold text-[#0071E3] hover:underline">
                1-800-MY-APPLE (692-7753)
              </a>
            </div>
          </div>

          <div className="bg-[#F5F5F7] rounded-3xl p-6 border border-[#D2D2D7]/50 flex items-start gap-4">
            <MapPin className="w-6 h-6 text-[#0071E3] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-[#1D1D1F] mb-1">Global Headquarters</h3>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                1 Apple Park Way<br />
                Cupertino, CA 95014<br />
                United States
              </p>
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50">
            <h3 className="font-bold text-base text-[#1D1D1F] mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-[#D2D2D7]/50">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left flex items-center justify-between font-semibold text-xs text-[#1D1D1F]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFaq === idx ? 'rotate-180 text-[#0071E3]' : 'text-[#6E6E73]'}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-[11px] text-[#6E6E73] mt-2 leading-relaxed border-t border-[#D2D2D7]/40 pt-2">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
