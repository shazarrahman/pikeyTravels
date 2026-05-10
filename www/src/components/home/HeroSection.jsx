import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function HeroSection() {
  const { data: settings, isLoading, error } = useSiteSettings();
  console.log('HeroSection - settings:', settings, 'isLoading:', isLoading, 'error:', error);
  const hero = settings?.hero || {};

  if (isLoading) return null;

  const showSection = hero.isVisible !== false;
  if (!showSection) return null;

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${hero.backgroundImageUrl || 'https://images.unsplash.com/photo-1502920916112-5a85a8d2d7c6?w=1920'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/40 via-dark-900/60 to-dark-900/80" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {hero.headline || 'Discover Your Next Adventure'}
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mb-8 drop-shadow-md">
          {hero.subheadline || 'Explore the best destinations with PikeyTravels'}
        </p>
        <Link
          to={hero.ctaLink || '/packages'}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-400 hover:from-accent-600 hover:to-accent-500 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-accent-500/30"
        >
          {hero.ctaLabel || 'Explore Packages'}
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;