import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { getReviews } from '../../api/reviews';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function ReviewsSection() {
  const { data: settings } = useSiteSettings();
  // Support both simple boolean (true/false) and nested shape { isVisible: boolean }
  const _reviewsSection = settings?.sections?.reviewsSection;
  let showSection = true;
  if (_reviewsSection === undefined) {
    showSection = true;
  } else if (typeof _reviewsSection === 'boolean') {
    showSection = _reviewsSection;
  } else if (_reviewsSection && typeof _reviewsSection === 'object') {
    showSection = _reviewsSection.isVisible !== false;
  }

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await getReviews();
      return res.data.data;
    }
  });

  const reviews = reviewsData?.filter(r => r.status === 'approved' && r.showOnFront !== false) || [];

  if (!showSection || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">What Our Travelers Say</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Real experiences from real travelers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.slice(0, 6).map((review) => (
            <div key={review._id} className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-500 font-semibold">{review.reviewerName?.charAt(0) || 'T'}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{review.reviewerName}</h4>
                  <p className="text-sm text-gray-500 capitalize">{review.serviceType}</p>
                </div>
              </div>
              <div className="flex mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-gray-600 mt-3 text-sm sm:text-base line-clamp-3">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;