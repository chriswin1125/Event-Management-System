import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Cpu,
  Music,
  Palette,
  Briefcase,
  Layers,
  Trophy,
  GraduationCap,
  Film,
  Compass,
  ArrowRight,
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0071E3] block mb-2">
          Curated Catalog
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F]">
          Event Categories.
        </h1>
        <p className="text-[#6E6E73] text-base sm:text-lg mt-3 leading-relaxed">
          From developer keynotes and industrial design exhibitions to symphonic acoustics and marathon sprints.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const IconComp = categoryIcons[cat.name] || Compass;
          return (
            <div
              key={cat._id}
              className="group bg-[#F5F5F7] rounded-3xl overflow-hidden border border-[#D2D2D7]/50 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
            >
              <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded-full bg-white/20 apple-blur flex items-center justify-center">
                    <IconComp className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-white">{cat.name}</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed mb-6">
                  {cat.description || 'Explore curated gatherings and keynotes in this category.'}
                </p>

                <div className="pt-4 border-t border-[#D2D2D7]/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1D1D1F]">
                    {cat.eventCount || 0} active event{cat.eventCount === 1 ? '' : 's'}
                  </span>
                  <Link
                    to={`/events?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] group/link"
                  >
                    <span>View Events</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
