import { Check } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function SiteInfoSection() {
  const { data: settings } = useSiteSettings();
  const siteInfo = settings?.siteInfo;
  const showSection = siteInfo?.isVisible !== false;

  if (!showSection) return null;

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {siteInfo?.heading || 'Discover Amazing Destinations'}
            </h2>
            <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">
              {siteInfo?.description || 'Explore the best travel experiences with us.'}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
              {(siteInfo?.stats || []).length > 0 ? siteInfo.stats.map((stat, index) => (
                <div key={index} className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary-500">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              )) : (
                <>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-primary-500">500+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Trips Completed</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-primary-500">200+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Expert Guides</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-primary-500">50+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Destinations</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-primary-500">98%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Happy Clients</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 lg:mt-0">
            <div className="space-y-3 sm:space-y-4">
              {[
                'Expert Local Guides',
                'Customized Itineraries',
                '24/7 Customer Support',
                'Best Price Guarantee'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SiteInfoSection;