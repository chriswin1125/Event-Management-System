import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const lowestPrice = event.lowestPrice !== undefined
    ? event.lowestPrice
    : (event.ticketTiers && event.ticketTiers.length > 0 ? Math.min(...event.ticketTiers.map(t => t.price)) : 0);

  return (
    <div className="group bg-[#F5F5F7] rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 border border-transparent hover:border-[#D2D2D7]/60">
      {/* Event Image Banner - Scaled up for immersive Apple feel */}
      <Link to={`/events/${event.slug || event._id}`} className="relative block h-64 sm:h-72 w-full overflow-hidden bg-neutral-200">
        <img
          src={event.bannerImage}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
        
        {/* Category Pill */}
        <span className="absolute top-4 left-4 bg-white/95 apple-blur text-[#1D1D1F] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
          {event.category}
        </span>

        {/* Featured Tag */}
        {event.isFeatured && (
          <span className="absolute top-4 right-4 bg-[#0071E3] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            Featured
          </span>
        )}

        {/* Date Overlay in Image */}
        <div className="absolute bottom-4 left-5 flex items-center text-white/95 text-xs sm:text-sm font-semibold gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{event.startTime}</span>
        </div>
      </Link>

      {/* Card Content - Zoomed in typography */}
      <div className="p-7 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/events/${event.slug || event._id}`} className="block group/title">
            <h3 className="text-[#1D1D1F] text-xl sm:text-2xl font-bold tracking-tight line-clamp-2 mb-2.5 group-hover/title:text-[#0071E3] transition-colors leading-tight">
              {event.title}
            </h3>
          </Link>
          <p className="text-[#6E6E73] text-sm sm:text-base line-clamp-2 mb-5 leading-relaxed">
            {event.shortDescription || event.description}
          </p>
        </div>

        <div>
          {/* Location Details */}
          <div className="flex items-center text-[#6E6E73] text-xs sm:text-sm gap-2 mb-6">
            <MapPin className="w-4 h-4 flex-shrink-0 text-[#1D1D1F]" />
            <span className="truncate">{event.venueName}, {event.city}</span>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-5 border-t border-[#D2D2D7]/70 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6E6E73] block font-semibold">Starting from</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F]">
                {lowestPrice === 0 ? 'Free' : `₹${lowestPrice.toLocaleString()}`}
              </span>
            </div>

            <Link
              to={`/events/${event.slug || event._id}`}
              className="inline-flex items-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-full transition-transform active:scale-95 shadow-md"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
