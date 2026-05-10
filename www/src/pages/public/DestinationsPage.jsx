import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { getDestinations } from '../../api/destinations';
import { Search, MapPin } from 'lucide-react';

function DestinationsPage() {
  const [search, setSearch] = useState('');

  const { data: destinationsData, isLoading } = useQuery({
    queryKey: ['destinations-list'],
    queryFn: async () => {
      const res = await getDestinations();
      return res.data.data;
    }
  });

  const destinations = destinationsData?.filter(d => d.isActive !== false) || [];

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="bg-primary-500 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white">Destinations</h1>
            <p className="text-white/80 mt-2">Explore India's most beautiful places</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative max-w-md mb-8">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No destinations found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <Link to={`/destinations/${dest._id}`} key={dest._id} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={dest.images?.[0] || 'https://images.unsplash.com/photo-1502920916112-5a85a8d2d7c6?w=400'}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary-500">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <MapPin size={14} />
                        {dest.state}
                      </div>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{dest.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(dest.highlights || []).slice(0, 3).map((h, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {h}
                          </span>
                        ))}
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

export default DestinationsPage;