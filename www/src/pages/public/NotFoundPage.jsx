import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Home, Search, MapPin, Package } from 'lucide-react';

function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | PikeyTravels</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="relative mb-8">
              <span className="text-[12rem] sm:text-[16rem] font-bold text-gray-100 leading-none select-none">404</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center">
                  <Search size={48} className="text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Home size={20} />
                Go to Homepage
              </Link>
              <Link
                to="/packages"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                <Package size={20} />
                Browse Packages
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t">
              <p className="text-gray-500 mb-4">Popular pages:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/packages" className="text-primary-500 hover:underline">Packages</Link>
                <Link to="/destinations" className="text-primary-500 hover:underline">Destinations</Link>
                <Link to="/provider" className="text-primary-500 hover:underline">List Your Hotel</Link>
                <Link to="/contact" className="text-primary-500 hover:underline">Contact Us</Link>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}

export default NotFoundPage;