import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Car, User, Calendar, DollarSign, Package, Eye, LogOut, MapPin, Phone, Image } from 'lucide-react';
import { getProviderBookings } from '../../api/bookings';
import toast from 'react-hot-toast';

function ProviderDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('pikey_provider');
    if (stored) {
      setProvider(JSON.parse(stored));
    } else {
      navigate('/provider/login');
    }
  }, []);

  const { data: bookingsData } = useQuery({
    queryKey: ['provider-bookings', provider?._id],
    queryFn: async () => {
      if (!provider?._id) return { data: { data: [] } };
      const res = await getProviderBookings();
      return res;
    },
    enabled: !!provider?._id
  });

  const bookings = bookingsData?.data?.data || [];
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const totalEarnings = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem('pikey_provider_token');
    localStorage.removeItem('pikey_provider');
    toast.success('Logged out');
    navigate('/provider');
  };

  if (!provider) return null;

  const getIcon = () => {
    switch (provider.type) {
      case 'hotel': return Building2;
      case 'cab': return Car;
      case 'guide': return User;
      default: return Building2;
    }
  };
  const Icon = getIcon();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <Icon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{provider.name}</h1>
                <p className="text-gray-500 text-sm capitalize">{provider.type} Provider</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <span className="text-gray-500">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <span className="text-gray-500">Confirmed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{confirmedBookings.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <span className="text-gray-500">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.packageId?.name || 'Package Booking'}</p>
                        <p className="text-sm text-gray-500">
                          {booking.guests} guests • {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : 'Date not set'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{booking.totalPrice?.toLocaleString()}</p>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">My Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{provider.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <p className="capitalize">{provider.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Location</label>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin size={14} /> {provider.location}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Contact</label>
                  <p className="font-medium flex items-center gap-1">
                    <Phone size={14} /> {provider.contactNumber}
                  </p>
                </div>
                {provider.description && (
                  <div>
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="text-sm">{provider.description}</p>
                  </div>
                )}
              </div>
            </div>

            {provider.images?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">My Images</h2>
                <div className="flex gap-2 overflow-x-auto">
                  {provider.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-24 h-24 object-cover rounded-lg" />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Status</h2>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  provider.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                <span className="capitalize font-medium">{provider.status}</span>
              </div>
              {provider.status === 'approved' && (
                <p className="text-sm text-green-600 mt-2">Your listing is visible on the website</p>
              )}
              {provider.status === 'pending' && (
                <p className="text-sm text-yellow-600 mt-2">Your listing is under review</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboardPage;