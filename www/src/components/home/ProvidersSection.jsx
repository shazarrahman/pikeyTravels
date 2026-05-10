import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Hotel, Car, User } from 'lucide-react';
import { getProviders } from '../../api/providers';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function ProviderCard({ provider, type }) {
  const icons = {
    hotel: Hotel,
    cab: Car,
    guide: User
  };
  const Icon = icons[type];

  return (
    <Link to={`/packages?provider=${provider._id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="relative h-40">
          <img
            src={provider.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
            alt={provider.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {provider.category || (provider.vehicleType ? provider.vehicleType : provider.expertise)}
          </div>
        </div>
          <div className="p-4">
          <h4 className="font-semibold text-gray-800">{provider.name}</h4>
          <p className="text-sm text-gray-500 mt-1">{provider.location || provider.city}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-primary-500 font-semibold">
              ₹{provider.pricePerDay || provider.pricePerPerson || provider.pricing?.perDay || provider.pricing?.perPerson || 0}/{(provider.pricePerDay || provider.pricing?.perDay) ? 'day' : 'person'}
            </span>
            {provider.rating && (
              <span className="text-sm text-gray-500">★ {provider.rating}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProvidersSection() {
  const { data: settings } = useSiteSettings();
  // Support both boolean and nested { isVisible } shapes
  const _providersSection = settings?.sections?.providersSection;
  let showSection = true;
  if (_providersSection === undefined) {
    showSection = true;
  } else if (typeof _providersSection === 'boolean') {
    showSection = _providersSection;
  } else if (_providersSection && typeof _providersSection === 'object') {
    showSection = _providersSection.isVisible !== false;
  }

  const { data: providersData, isLoading } = useQuery({
    queryKey: ['providers-front'],
    queryFn: async () => {
      const res = await getProviders({ showOnFront: true, limit: 6 });
      return res.data.data;
    }
  });

  if (!showSection) return null;

  const providers = providersData || [];
  const hotels = providers.filter(p => p.type === 'hotel').slice(0, 3);
  const cabs = providers.filter(p => p.type === 'cab').slice(0, 3);
  const guides = providers.filter(p => p.type === 'guide').slice(0, 3);

  if (providers.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Hotels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {hotels.map((hotel) => (
                  <ProviderCard key={hotel._id} provider={hotel} type="hotel" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Premium Cabs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {cabs.map((cab) => (
                  <ProviderCard key={cab._id} provider={cab} type="cab" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Expert Guides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {guides.map((guide) => (
                  <ProviderCard key={guide._id} provider={guide} type="guide" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProvidersSection;