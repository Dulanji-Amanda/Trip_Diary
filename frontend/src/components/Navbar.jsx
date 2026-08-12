import { Link, useLocation } from 'react-router-dom';
import { Map, User, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-600 font-semibold' : 'text-slate-600 hover:text-primary-500';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Map className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                TripDiary
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className={`flex items-center gap-1 ${isActive('/')}`}>
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/profile" className={`flex items-center gap-1 ${isActive('/profile')}`}>
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
