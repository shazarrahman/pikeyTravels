import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Hotel, Car, User, ArrowRight } from 'lucide-react';

function ProviderLandingPage() {
  const providerTypes = [
    {
      icon: Hotel,
      title: 'List Your Hotel',
      description: 'Register your hotel or guesthouse and reach thousands of travelers.',
      link: '/provider/hotel-register',
      color: 'bg-orange-500'
    },
    {
      icon: Car,
      title: 'Register Your Cab',
      description: 'Add your taxi or cab service and get booked by travelers.',
      link: '/provider/cab-register',
      color: 'bg-blue-500'
    },
    {
      icon: User,
      title: 'Become a Guide',
      description: 'Share your local expertise and show travelers around your city.',
      link: '/provider/guide-register',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="bg-primary-500 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white">Partner With Us</h1>
            <p className="text-white/80 mt-2">List your services and grow your business</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {providerTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto`}>
                  <type.icon size={32} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-6">{type.title}</h2>
                <p className="text-gray-600 mt-2">{type.description}</p>
                <Link
                  to={type.link}
                  className="inline-flex items-center gap-2 mt-4 text-primary-500 font-semibold hover:underline"
                >
                  Get Started
                  <ArrowRight size={20} />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already registered?{' '}
              <Link to="/provider/login" className="text-primary-500 font-semibold hover:underline">
                Login to Dashboard
              </Link>
            </p>
          </div>

          <div className="mt-16 bg-gray-100 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Partner With PikeyTravels?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800">Reach More Customers</h3>
                <p className="text-gray-600 text-sm mt-2">Get access to thousands of travelers looking for quality services.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Easy Management</h3>
                <p className="text-gray-600 text-sm mt-2">Simple dashboard to manage bookings and track your performance.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Secure Payments</h3>
                <p className="text-gray-600 text-sm mt-2">Timely payments directly to your bank account.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProviderLandingPage;