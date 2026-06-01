import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, Bell, BookOpen, Home } from 'lucide-react';
import { useTimetable } from '../context/TimetableContext';
import logoUrl from '../assets/logo.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { notifications } = useTimetable();

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/timetable', label: 'Timetable', icon: BookOpen },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: notifications.length },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logoUrl} alt="University of Okara Logo" className="w-10 h-10 object-contain" />
            <div className="leading-tight">
              <p className="font-heading text-sm font-bold text-slate-800">University of Okara</p>
              <p className="text-[10px] text-indigo-600 font-medium tracking-wider uppercase">Timetable Portal</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon, badge }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${pathname === to
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Icon size={15} />
                {label}
                {badge > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {links.map(({ to, label, icon: Icon, badge }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${pathname === to ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
            >
              <Icon size={16} />
              {label}
              {badge > 0 && (
                <span className="ml-auto bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
