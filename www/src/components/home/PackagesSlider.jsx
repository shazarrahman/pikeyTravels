import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star, Clock, MapPin } from 'lucide-react';
import { getFeaturedPackages } from '../../api/packages';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import 'swiper/css';
import 'swiper/css/navigation';

function PackageCard({ pkg }) {
  return (
    <Link to={`/packages/${pkg._id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={pkg.coverImage || 'https://images.unsplash.com/photo-1502920916112-5a85a8d2d7c6?w=400'}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {pkg.isFeatured && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-accent-400 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
              Featured
            </span>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-semibold text-gray-800 group-hover:text-primary-500 transition-colors text-base sm:text-lg line-clamp-1">
            {pkg.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MapPin size={14} />
            <span className="line-clamp-1">{pkg.destinationId?.name || 'Destination'}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              {pkg.rating && (
                <>
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{pkg.rating}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              {pkg.durationDays} Days
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xl sm:text-2xl font-bold text-primary-600">
              ₹{pkg.basePrice?.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500"> / person</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PackagesSlider() {
  const { data: settings } = useSiteSettings();
  // Support both boolean and nested { isVisible } shapes
  const _packagesSection = settings?.sections?.packagesSlider;
  let showSection = true;
  if (_packagesSection === undefined) {
    showSection = true;
  } else if (typeof _packagesSection === 'boolean') {
    showSection = _packagesSection;
  } else if (_packagesSection && typeof _packagesSection === 'object') {
    showSection = _packagesSection.isVisible !== false;
  }

  const { data: packagesData, isLoading } = useQuery({
    queryKey: ['featured-packages'],
    queryFn: async () => {
      const res = await getFeaturedPackages();
      return res.data.data;
    }
  });

  if (!showSection) return null;

  const packages = packagesData?.filter(p => p.showOnFront !== false) || [];

  if (packages.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Popular Packages</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Handpicked experiences for unforgettable journeys</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 }
              }}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next'
              }}
              className="packages-slider"
            >
              {packages.map((pkg) => (
                <SwiperSlide key={pkg._id}>
                  <PackageCard pkg={pkg} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            <button className="swiper-button-prev hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-primary-500 hover:text-white transition-colors items-center justify-center">
              <ChevronLeft size={24} />
            </button>
            <button className="swiper-button-next hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-primary-500 hover:text-white transition-colors items-center justify-center">
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/packages" className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:underline">
            View All Packages
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PackagesSlider;