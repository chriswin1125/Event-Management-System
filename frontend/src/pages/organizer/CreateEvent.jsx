import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Image,
  Ticket,
  Plus,
  Trash2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const presetImages = [
  { label: 'Keynote & Tech', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=85' },
  { label: 'Symphony & Music', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=85' },
  { label: 'Architecture & Design', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=85' },
  { label: 'AI & Data Summit', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=85' },
  { label: 'Developer Workshop', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=85' },
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Technology',
    date: '',
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    venueName: '',
    address: '',
    city: 'Cupertino',
    state: 'California',
    country: 'United States',
    bannerImage: presetImages[0].url,
    ticketTiers: [
      {
        tierName: 'General Admission',
        price: 999,
        totalSeats: 100,
        description: 'Standard event pass with access to all keynote sessions.',
        perks: ['Event program book', 'Access to general seating'],
      },
    ],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddTier = () => {
    setFormData({
      ...formData,
      ticketTiers: [
        ...formData.ticketTiers,
        {
          tierName: 'VIP Pass',
          price: 2499,
          totalSeats: 25,
          description: 'Front-row seating and executive networking access.',
          perks: ['Reserved seating', 'Networking reception'],
        },
      ],
    });
  };

  const handleRemoveTier = (index) => {
    if (formData.ticketTiers.length <= 1) return;
    setFormData({
      ...formData,
      ticketTiers: formData.ticketTiers.filter((_, idx) => idx !== index),
    });
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...formData.ticketTiers];
    updated[index][field] = value;
    setFormData({ ...formData, ticketTiers: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/events', formData);
      setSuccess(res.data.message || 'Event created successfully!');
      setTimeout(() => {
        navigate('/organizer');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
          New Submission
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
          Publish an Event.
        </h1>
        <p className="text-[#6E6E73] text-base mt-2">
          Design your event page with Apple precision and define ticket tiers.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#1D1D1F]">1. General Information</h2>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Event Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Apple Global AI Summit 2026"
              className="w-full bg-white rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Event Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Start Time</label>
              <input
                type="text"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="10:00 AM"
                className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">End Time</label>
              <input
                type="text"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="05:00 PM"
                className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Short Description (Summary)</label>
            <input
              type="text"
              required
              maxLength={240}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="A high-impact headline summarizing the keynote or experience."
              className="w-full bg-white rounded-xl px-4 py-3 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Detailed Description & Agenda</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full details regarding guest speakers, sessions, requirements, and venue rules..."
              className="w-full bg-white rounded-xl p-4 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            ></textarea>
          </div>
        </div>

        {/* Location & Venue */}
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#1D1D1F]">2. Venue & Location</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Venue Name</label>
              <input
                type="text"
                required
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                placeholder="Steve Jobs Theater / Moscone Center"
                className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Street Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="1 Apple Park Way"
                className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Cupertino"
                className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">State / Province</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="California"
                className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Visual Banner */}
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#1D1D1F]">3. High-Definition Banner Image</h2>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-2">Select from Apple-Curated Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {presetImages.map((img) => (
                <div
                  key={img.label}
                  onClick={() => setFormData({ ...formData, bannerImage: img.url })}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                    formData.bannerImage === img.url ? 'border-[#0071E3] ring-2 ring-[#0071E3]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="h-20 w-full object-cover" />
                  <span className="block text-[10px] font-semibold text-center py-1 bg-white truncate px-1">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>

            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Or paste custom image URL</label>
            <input
              type="url"
              required
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              className="w-full bg-white rounded-xl px-4 py-2.5 text-xs text-[#1D1D1F] border border-[#D2D2D7]/70 focus:outline-none"
            />
          </div>
        </div>

        {/* Ticket Tiers */}
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7]/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1D1D1F]">4. Ticket Tiers & Capacity</h2>
              <p className="text-xs text-[#6E6E73]">Configure multi-tiered pricing and reserved allocations</p>
            </div>
            <button
              type="button"
              onClick={handleAddTier}
              className="apple-btn-secondary px-4 py-2 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tier</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.ticketTiers.map((tier, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[#D2D2D7]/60 relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0071E3]">
                    Tier #{idx + 1}
                  </span>
                  {formData.ticketTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="text-[#6E6E73] hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1D1D1F] mb-1">Tier Name</label>
                    <input
                      type="text"
                      required
                      value={tier.tierName}
                      onChange={(e) => handleTierChange(idx, 'tierName', e.target.value)}
                      placeholder="e.g. VIP Pass"
                      className="w-full bg-[#F5F5F7] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] border border-[#D2D2D7]/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1D1D1F] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={tier.price}
                      onChange={(e) => handleTierChange(idx, 'price', e.target.value)}
                      className="w-full bg-[#F5F5F7] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] border border-[#D2D2D7]/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1D1D1F] mb-1">Total Capacity</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={tier.totalSeats}
                      onChange={(e) => handleTierChange(idx, 'totalSeats', e.target.value)}
                      className="w-full bg-[#F5F5F7] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] border border-[#D2D2D7]/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1D1D1F] mb-1">Description & Perks</label>
                  <input
                    type="text"
                    value={tier.description}
                    onChange={(e) => handleTierChange(idx, 'description', e.target.value)}
                    placeholder="Short description of what is included..."
                    className="w-full bg-[#F5F5F7] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] border border-[#D2D2D7]/60 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/organizer')}
            className="apple-btn-secondary px-6 py-3 text-xs"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Publish Event</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
