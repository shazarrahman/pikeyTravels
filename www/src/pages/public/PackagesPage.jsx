import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { getPackages, getFeaturedPackages } from '../../api/packages';
import { getDestinations } from '../../api/destinations';
import { Search, Star, Clock, MapPin, Calendar, Users } from 'lucide-react';

function PackagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '');

  // load destinations first so we can accept either a destination name or id in the URL
  const { data: destinations } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const res = await getDestinations();
      return res.data.data;
    }
  });

  // normalize destination param: if user passed a name (e.g., Jaipur) map it to the destination _id
  const [normalizedDestination, setNormalizedDestination] = useState(destination);

  useEffect(() => {
    if (!destination) {
      setNormalizedDestination('');
      return;
    }
    // if already looks like an ObjectId, keep it
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(destination);
    if (isObjectId) {
      setNormalizedDestination(destination);
      return;
    }
    // try to resolve name -> id using loaded destinations
    const found = (destinations || []).find(d => d.name.toLowerCase() === destination.toLowerCase());
    if (found) {
      setNormalizedDestination(found._id);
      // update URL to canonical id so shareable links work
      const newParams = new URLSearchParams(searchParams);
      newParams.set('destination', found._id);
      setSearchParams(newParams);
    } else {
      // not resolved yet; keep original value to avoid losing user input
      setNormalizedDestination(destination);
    }
  }, [destination, destinations]);

  const { data: packagesData, isLoading: loadingPackages } = useQuery({
    queryKey: ['packages', normalizedDestination, search, guests],
    queryFn: async () => {
      const params = {};
      if (normalizedDestination) params.destinationId = normalizedDestination;
      if (search) params.q = search;
      if (guests) params.guests = guests;
      const res = await getPackages(params);
      return res.data.data;
    }
  });

  const filteredPackages = packagesData?.filter(pkg => {
    const showOnFront = pkg.showOnFront !== false;
    if (!showOnFront) return false;
    
    const matchSearch = !search || 
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(search.toLowerCase());
    
    return matchSearch;
  }) || [];

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Travel Packages</h1>
            <p className="text-white/80 mt-2">Find your perfect getaway</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    handleFilterChange('q', e.target.value);
                  }}
                />
              </div>
              
              <select
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  handleFilterChange('destination', e.target.value);
                }}
              >
                <option value="">All Destinations</option>
                {destinations?.filter(d => d.isActive !== false).map(dest => (
                  <option key={dest._id} value={dest._id}>{dest.name}</option>
                ))}
              </select>
              
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={guests}
                  onChange={(e) => {
                    setGuests(e.target.value);
                    handleFilterChange('guests', e.target.value);
                  }}
                >
                  <option value="">Guests</option>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loadingPackages ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Packages Found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <Link to={`/packages/${pkg._id}`} key={pkg._id} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pkg.coverImage || 'https://images.unsplash.com/photo-1502920916112-5a85a8d2d7c6?w=400'}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {pkg.isFeatured && (
                        <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors line-clamp-1">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin size={14} />
                        {pkg.destinationId?.name || 'Destination'}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} />
                          {pkg.durationDays} Days
                        </div>
                        {pkg.rating && (
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{pkg.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xl font-bold text-primary-500">
                          ₹{pkg.basePrice?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500"> / person</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PackagesPage;