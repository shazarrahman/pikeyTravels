import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bus, Hotel, Mountain, Settings } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: siteSettings } = useSiteSettings();
  const { user, isAuthenticated, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = siteSettings?.navItems?.filter(item => item.isVisible) || [
    { label: 'Home', path: '/', isExternal: false },
    { label: 'Destinations', path: '/destinations', isExternal: false },
    { label: 'Packages', path: '/packages', isExternal: false },
    { label: 'Contact', path: '/contact', isExternal: false }
  ];

  // ensure stable ordering and prepare overflow handling
  navItems.sort((a, b) => (a.order || 0) - (b.order || 0));
  const MAX_VISIBLE = 4; // show up to 4 primary items
  const hasOverflow = navItems.length > 5;
  const visibleNav = hasOverflow ? navItems.slice(0, MAX_VISIBLE) : navItems.slice(0, 5);
  const overflowNav = hasOverflow ? navItems.slice(MAX_VISIBLE) : [];

  const siteName = siteSettings?.branding?.siteName || 'PikeyTravels';
  const logoUrl = siteSettings?.branding?.logoUrl;

  const handleNavClick = (item) => {
    setIsOpen(false);
    if (item.isExternal) {
      window.open(item.path, '_blank');
    }
  };

  const solid = isScrolled || location.pathname !== '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${solid ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-8 sm:h-10 w-auto object-contain" />
              ) : (
                <span className={`text-xl sm:text-2xl font-bold ${solid ? 'text-primary-500' : 'text-white'}`}>
                  {siteName}
                </span>
              )}
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {visibleNav.map((item) => (
              item.isExternal ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                    solid ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => handleNavClick(item)}
                  className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                    location.pathname === item.path
                      ? 'text-primary-500'
                      : solid ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}

            {overflowNav.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(o => !o)}
                  className={`text-sm font-medium transition-colors px-2 py-1 rounded ${solid ? 'text-gray-700 bg-white/0 hover:text-primary-500' : 'text-white hover:text-primary-200'}`}
                >
                  More
                </button>
                {moreOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-40 py-2">
                    {overflowNav.map(item => (
                      item.isExternal ? (
                        <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMoreOpen(false)}>{item.label}</a>
                      ) : (
                        <Link key={item.path} to={item.path} onClick={() => { setMoreOpen(false); handleNavClick(item); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{item.label}</Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

           <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
             <Link
               to="/provider"
               className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-400 text-white rounded-lg hover:from-accent-600 hover:to-accent-500 transition-all shadow-md hover:shadow-accent-500/30 text-sm"
             >
               <Hotel size={16} />
               <span className="text-sm font-medium hidden lg:inline">List Your Hotel</span>
             </Link>
             {isAuthenticated && user?.role === 'admin' && (
               <Link
                 to="/superadmin"
                 className={`p-2 rounded-full transition-colors ${
                   solid ? 'bg-gray-100 text-gray-700 hover:bg-primary-100' : 'bg-white/20 text-white hover:bg-white/30'
                 }`}
                 title="Admin Panel"
               >
                 <Settings size={20} />
               </Link>
             )}
             {isAuthenticated ? (
               <div className="relative">
                 <button
                   onClick={() => setUserMenuOpen(open => !open)}
                   className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                     solid ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30'
                   }`}
                   title={`Signed in as ${user?.name || user?.email}`}
                 >
                   <User size={18} />
                   <span className="hidden sm:inline text-sm font-medium">{user?.name || user?.email}</span>
                 </button>

                 {userMenuOpen && (
                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-40 py-2">
                     <div className="px-4 py-3 border-b">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</div>
                         <div>
                           <div className="text-sm font-medium text-gray-900">{user?.name || user?.email}</div>
                           <div className="text-xs text-gray-500">{user?.email}</div>
                         </div>
                       </div>
                     </div>
                     <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile &amp; Edit</Link>
                     <Link to="/bookings" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Bookings</Link>
                     <div className="mt-2 border-t">
                       <button
                         onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                       >
                         Logout
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             ) : (
               <Link
                 to="/login"
                 className={`p-2 rounded-full transition-colors ${
                   solid ? 'bg-gray-100 text-gray-700 hover:bg-primary-100' : 'bg-white/20 text-white hover:bg-white/30'
                 }`}
               >
                 <User size={20} />
               </Link>
             )}
           </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={24} className={solid ? 'text-gray-700' : 'text-white'} />
            ) : (
              <Menu size={24} className={solid ? 'text-gray-700' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              item.isExternal ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-gray-700 hover:text-primary-500"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block py-2 text-gray-700 hover:text-primary-500"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link
              to="/provider"
              className="flex items-center gap-2 py-2 text-accent-500"
              onClick={() => setIsOpen(false)}
            >
              <Hotel size={18} />
              <span>List Your Hotel</span>
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/superadmin"
                className="flex items-center gap-2 py-2 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} />
                <span>Admin Panel</span>
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate('/');
                }}
                className="flex items-center gap-2 py-2 text-gray-700 w-full text-left"
              >
                <User size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;