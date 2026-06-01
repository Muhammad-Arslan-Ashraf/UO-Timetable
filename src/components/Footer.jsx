import { GraduationCap, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.png';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="bg-white p-1 rounded-xl shadow-sm">
              <img src={logoUrl} alt="University Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="font-heading text-white text-sm font-bold">University of Okara</p>
              <p className="text-[10px] text-indigo-400 uppercase tracking-wider">Timetable Portal</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            Providing quality education and empowering students with knowledge, skills, and values.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/timetable', label: 'View Timetable' },
              { to: '/notifications', label: 'Notifications' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-indigo-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 text-indigo-400 shrink-0" />
              University Road, Okara, Punjab, Pakistan
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-indigo-400" />
              +92 (044) 2520126
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-indigo-400" />
              info@uokara.edu.pk
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p>© {new Date().getFullYear()} University of Okara. All rights reserved.</p>
        <Link to="/admin/login" className="text-slate-600 hover:text-indigo-400 transition-colors">
          Admin Panel
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
