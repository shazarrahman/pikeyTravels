import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function Footer() {
  const { data: settings, isLoading } = useSiteSettings();
  const footer = settings?.footer || {};

  if (isLoading) return null;

  const showFooter = settings?.footer?.isVisible !== false;
  if (!showFooter) return null;

  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary-500 mb-4">PikeyTravels</h3>
            <p className="text-gray-400 text-sm">{footer.aboutText || 'Your trusted travel partner'}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/destinations" className="text-gray-400 hover:text-white">Destinations</Link></li>
              <li><Link to="/packages" className="text-gray-400 hover:text-white">Packages</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Providers</h4>
            <ul className="space-y-2">
              <li><Link to="/provider" className="text-gray-400 hover:text-white">List Your Hotel</Link></li>
              <li><Link to="/provider" className="text-gray-400 hover:text-white">Register Cab</Link></li>
              <li><Link to="/provider" className="text-gray-400 hover:text-white">Become a Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} />
                <span className="text-sm">{footer.address || 'Address'}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={18} />
                <span className="text-sm">{footer.phone || 'Phone'}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={18} />
                <span className="text-sm">{footer.email || 'Email'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{footer.copyrightText || '© 2026 PikeyTravels. All rights reserved.'}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href={footer.socialLinks?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <ExternalLink size={20} />
            </a>
            <a href={footer.socialLinks?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <ExternalLink size={20} />
            </a>
            <a href={footer.socialLinks?.youtube || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;