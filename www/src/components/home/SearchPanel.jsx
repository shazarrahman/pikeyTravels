import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { getDestinations } from '../../api/destinations';

function SearchPanel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    guests: 2
  });

  const { data: destinationsData, isLoading } = useQuery({
    queryKey: ['destinations-list'],
    queryFn: async () => {
      const res = await getDestinations();
      return res.data.data;
    }
  });

  const destinations = destinationsData?.filter(d => d.isActive !== false) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.destination) params.set('destination', formData.destination);
    if (formData.date) params.set('date', formData.date);
    if (formData.guests) params.set('guests', formData.guests);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <section className="relative -mt-20 z-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/50"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="">{isLoading ? 'Loading...' : 'Select Destination'}</option>
                  {destinations.map((dest) => (
                    <option key={dest._id} value={dest.name}>
                      {dest.name}, {dest.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/50"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <div className="relative">
                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/50"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                >
                  {[1,2,3,4,5,6,7,8].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary-500/30"
              >
                <Search size={20} />
                Find Packages
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SearchPanel;