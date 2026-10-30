import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  PlusCircle,
  Shield,
  Bell,
  ChevronDown,
  Sparkles,
  Layers,
  LayoutDashboard,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const Navbar = ({ isHomePage = false }) => {
  const { user, logout, isAdmin, isOrganizer, notifications, unreadNotificationsCount, markNotificationsAsRead, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkNav = isHomePage && !scrolled;

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Events', path: '/events' },
    { name: 'Categories', path: '/categories' },
    ...(user ? [{ name: 'My Bookings', path: '/user/bookings' }] : []),
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isDarkNav
          ? 'bg-black/40 apple-blur border-b border-white/10 text-white'
          : scrolled
          ? 'bg-white/85 apple-blur border-b border-[#D2D2D7]/70 shadow-[0_4px_25px_rgba(0,0,0,0.05)] text-[#1D1D1F]'
          : 'bg-[#F5F5F7]/90 apple-blur border-b border-[#D2D2D7]/50 text-[#1D1D1F]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* NexEvent Brand: Separate Icon Picture + HTML Text Container */}
          <BrandLogo isDark={isDarkNav} size="md" />

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm tracking-tight transition-colors py-1 ${
                    isActive
                      ? 'text-[#0071E3] font-semibold border-b-2 border-[#0071E3]'
                      : isDarkNav
                      ? 'text-white/85 hover:text-white font-medium'
                      : 'text-[#1D1D1F]/80 hover:text-[#1D1D1F] font-medium'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                  isDarkNav
                    ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F] bg-[#E8E8ED]/80 hover:bg-[#E8E8ED]'
                }`}
                title="Switch demo account"
              >
                <span>Demo Accounts</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#D2D2D7]/70 py-2 z-50 animate-in fade-in zoom-in-95 text-[#1D1D1F]">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#6E6E73]">
                    1-Click Fast Login
                  </div>
                  <button
                    onClick={() => {
                      demoLogin('admin');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-between"
                  >
                    <span>Admin (Tim Cook)</span>
                    <Shield className="w-3 h-3 text-red-500" />
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('organizer');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-between"
                  >
                    <span>Organizer (Craig F.)</span>
                    <Layers className="w-3 h-3 text-indigo-500" />
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('user');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-between"
                  >
                    <span>User (Alex Morgan)</span>
                    <User className="w-3 h-3 text-emerald-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen && unreadNotificationsCount > 0) {
                      markNotificationsAsRead();
                    }
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#E8E8ED]/60 transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0071E3] rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#D2D2D7]/70 py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-[#D2D2D7]/40 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1D1D1F]">Notifications</span>
                      <button
                        onClick={markNotificationsAsRead}
                        className="text-[11px] text-[#0071E3] hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#6E6E73]">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          className="px-4 py-3 hover:bg-[#F5F5F7] border-b border-[#D2D2D7]/30 last:border-none transition-colors"
                        >
                          <p className="text-xs font-semibold text-[#1D1D1F]">{n.title}</p>
                          <p className="text-[11px] text-[#6E6E73] mt-0.5 line-clamp-2">{n.message}</p>
                          <span className="text-[9px] text-[#86868B] mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login CTA */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-medium text-[#1D1D1F] hover:opacity-80 transition-opacity bg-white/80 border border-[#D2D2D7]/60 pl-2 pr-3 py-1 rounded-full shadow-sm"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-[#6E6E73]" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#D2D2D7]/70 py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#D2D2D7]/40">
                      <p className="text-xs font-semibold text-[#1D1D1F] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#6E6E73] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wide bg-[#F5F5F7] text-[#1D1D1F] px-2 py-0.5 rounded-full font-bold">
                        {user.role}
                      </span>
                    </div>

                    {/* Admin Link */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-red-500" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {/* Organizer Link */}
                    {isOrganizer && (
                      <Link
                        to="/organizer"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Organizer Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/user/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/user/bookings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>My Bookings</span>
                    </Link>

                    <div className="border-t border-[#D2D2D7]/40 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className={`text-sm font-medium px-3.5 py-1.5 transition-colors ${
                    isDarkNav ? 'text-white hover:text-neutral-200' : 'text-[#1D1D1F] hover:text-[#0071E3]'
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="apple-btn-primary text-sm px-5 py-2 shadow-sm font-semibold"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkNav
                  ? 'text-white hover:bg-white/15'
                  : 'text-[#1D1D1F] hover:bg-[#E8E8ED]'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 apple-blur border-b border-[#D2D2D7] px-6 py-5 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#1D1D1F] py-2 border-b border-[#D2D2D7]/30"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 pb-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-[#1D1D1F]">{user.name}</p>
                  <span className="text-[10px] text-[#6E6E73] capitalize">{user.role}</span>
                </div>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-semibold text-red-600 py-1"
                >
                  Admin Dashboard
                </Link>
              )}

              {isOrganizer && (
                <Link
                  to="/organizer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-semibold text-indigo-600 py-1"
                >
                  Organizer Dashboard
                </Link>
              )}

              <Link
                to="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs text-[#1D1D1F] py-1"
              >
                My Account
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block text-xs text-red-500 py-1 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 flex gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-medium bg-[#F5F5F7] rounded-full text-[#1D1D1F]"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-medium bg-[#0071E3] text-white rounded-full"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
