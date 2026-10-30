import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { EventGridSkeleton } from '../components/LoadingSkeleton';
import { Search, Filter, Calendar, MapPin, X, ArrowUpDown } from 'lucide-react';

const citiesList = ['All', 'Cupertino', 'San Francisco', 'Los Angeles', 'New York', 'Monterey', 'Palo Alto'];

const ExploreEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // Fetch Categories list
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

  // Fetch Events with query parameters
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (search.trim()) params.append('search', search.trim());
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedCity && selectedCity !== 'All') params.append('city', selectedCity);
        if (sortBy) params.append('sort', sortBy);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const res = await api.get(`/events?${params.toString()}`);
        setEvents(res.data.data || []);
        setTotalCount(res.data.total || 0);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchEvents();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [search, selectedCategory, selectedCity, sortBy, startDate, endDate]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setSortBy('date');
    setStartDate('');
    setEndDate('');
    setSearchParams({});
  };

  return (
    <div className="bg-white min-h-screen py-14 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="max-w-4xl mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
          Worldwide Directory
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1D1D1F]">
          Explore Events.
        </h1>
        <p className="text-[#6E6E73] text-lg sm:text-xl mt-3 leading-relaxed">
          Discover extraordinary conferences, live masterclasses, spatial audio symphonies, and cultural exhibits.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#F5F5F7] rounded-3xl p-5 sm:p-8 mb-12 border border-[#D2D2D7]/60 shadow-sm space-y-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#6E6E73] absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, venue, speaker or keyword..."
            className="w-full bg-white rounded-full pl-14 pr-12 py-4 text-base text-[#1D1D1F] placeholder-[#6E6E73] border border-[#D2D2D7]/80 focus:outline-none focus:ring-2 focus:ring-[#0071E3] shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-1">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchParams({});
            }}
            className={`text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#1D1D1F] text-white shadow-sm'
                : 'bg-white text-[#1D1D1F] border border-[#D2D2D7]/70 hover:bg-neutral-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSearchParams({ category: cat.name });
              }}
              className={`text-sm font-medium px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-[#0071E3] text-white shadow-sm'
                  : 'bg-white text-[#1D1D1F] border border-[#D2D2D7]/70 hover:bg-neutral-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Extended Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* City Filter */}
          <div className="flex items-center bg-white rounded-2xl px-3 py-2 border border-[#D2D2D7]/80">
            <MapPin className="w-4 h-4 text-[#6E6E73] mr-2 flex-shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1D1D1F] focus:outline-none cursor-pointer"
            >
              <option value="All">All Locations</option>
              {citiesList.filter((c) => c !== 'All').map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center bg-white rounded-2xl px-3 py-2 border border-[#D2D2D7]/80">
            <ArrowUpDown className="w-4 h-4 text-[#6E6E73] mr-2 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1D1D1F] focus:outline-none cursor-pointer"
            >
              <option value="date">Upcoming First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex items-center bg-white rounded-2xl px-3 py-2 border border-[#D2D2D7]/80">
            <Calendar className="w-4 h-4 text-[#6E6E73] mr-2 flex-shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1D1D1F] focus:outline-none"
              title="From date"
            />
          </div>

          {/* Reset Action */}
          <button
            onClick={resetFilters}
            className="flex items-center justify-center text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] bg-white rounded-2xl px-3 py-2 border border-[#D2D2D7]/80 hover:bg-neutral-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">
          Showing {events.length} of {totalCount} events
        </p>
      </div>

      {/* Events Grid */}
      {loading ? (
        <EventGridSkeleton count={6} />
      ) : events.length === 0 ? (
        <div className="text-center py-24 bg-[#F5F5F7] rounded-3xl border border-[#D2D2D7]/50 max-w-2xl mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-white text-[#6E6E73] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">No matching events found</h3>
          <p className="text-[#6E6E73] text-sm mb-6">
            Try adjusting your search criteria, clearing your date filters, or selecting "All Categories".
          </p>
          <button
            onClick={resetFilters}
            className="apple-btn-primary text-xs px-6 py-2.5 shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreEvents;
