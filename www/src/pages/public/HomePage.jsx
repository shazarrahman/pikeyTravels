import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/home/HeroSection';
import SearchPanel from '../../components/home/SearchPanel';
import PackagesSlider from '../../components/home/PackagesSlider';
import SiteInfoSection from '../../components/home/SiteInfoSection';
import ReviewsSection from '../../components/home/ReviewsSection';
import ProvidersSection from '../../components/home/ProvidersSection';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SearchPanel />
        <PackagesSlider />
        <SiteInfoSection />
        <ProvidersSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;