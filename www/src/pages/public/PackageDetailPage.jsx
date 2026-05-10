import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomizerPanel from '../../components/package/CustomizerPanel';
import { Star, Clock, MapPin, Calendar, Plus, Minus } from 'lucide-react';
import { getPackageById } from '../../api/packages';
import { getProviders } from '../../api/providers';
import { getAddOns } from '../../api/addons';
import { getSiteSettings } from '../../api/siteSettings';
import { createReview } from '../../api/reviews';
import { useCustomization } from '../../context/CustomizationContext';
import { createBooking } from '../../api/bookings';
import toast from 'react-hot-toast';

function PackageDetailPage() {
  const { id } = useParams();
  const { state, dispatch, calculateTotal } = useCustomization();
  // Keep hooks at the top-level so React hook order doesn't change between renders
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    travelDate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    specialRequests: ''
  });

  const { data: pkgData, isLoading: loadingPkg } = useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      const res = await getPackageById(id);
      return res.data.data;
    }
  });

  const { data: providersData } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const res = await getProviders();
      return res.data.data;
    }
  });

  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const res = await getSiteSettings();
      return res.data.data;
    }
  });

  const [reviewForm, setReviewForm] = useState({ reviewerName: '', rating: 5, comment: '' });

  const { data: addOnsData } = useQuery({
    queryKey: ['addOns'],
    queryFn: async () => {
      const res = await getAddOns();
      return res.data.data;
    }
  });

  if (loadingPkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pkgData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Package Not Found</h1>
            <Link to="/packages" className="text-primary-500 hover:underline mt-4 block">
              Back to Packages
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pkg = pkgData;
  const total = calculateTotal(pkg);

  const handleOpenBooking = () => setShowBookingModal(true);
  const handleCloseBooking = () => setShowBookingModal(false);

  const handleBookingChange = (key, value) => setBookingForm(prev => ({ ...prev, [key]: value }));

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        packageId: pkg._id,
        selectedHotelId: state.selectedHotel?._id,
        selectedCabId: state.selectedCab?._id,
        selectedGuideId: state.selectedGuide?._id,
        selectedAddOns: state.selectedAddOns.map(a => ({ addOnId: a._id, label: a.label, price: a.priceType === 'perDay' ? a.price * pkg.durationDays : a.price, priceType: a.priceType })),
        travelDate: bookingForm.travelDate,
        guests: state.guests || 1,
        totalPrice: total,
        contactName: bookingForm.contactName,
        contactPhone: bookingForm.contactPhone,
        contactEmail: bookingForm.contactEmail,
        specialRequests: bookingForm.specialRequests
      };

      await createBooking(payload);
      toast.success('Booking submitted — we will contact you soon');
      handleCloseBooking();
    } catch (err) {
      console.error('Booking error', err);
      toast.error(err.response?.data?.message || 'Failed to submit booking');
    }
  };

  const handleGuestChange = (delta) => {
    const newGuests = Math.max(1, state.guests + delta);
    if (pkg.maxGuests && newGuests > pkg.maxGuests) {
      toast.error(`Maximum ${pkg.maxGuests} guests allowed for this package`);
      return;
    }
    dispatch({ type: 'SET_GUESTS', payload: newGuests });
  };

  const handleGuestSelect = (value) => {
    const v = Number(value);
    if (pkg.maxGuests && v > pkg.maxGuests) {
      toast.error(`Maximum ${pkg.maxGuests} guests allowed for this package`);
      return;
    }
    dispatch({ type: 'SET_GUESTS', payload: v });
  };

  const handleReviewChange = (key, value) => setReviewForm(prev => ({ ...prev, [key]: value }));

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        reviewerName: reviewForm.reviewerName || 'Anonymous',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        serviceType: 'overall',
        serviceId: pkg._id
      };
      await createReview(payload);
      toast.success('Review submitted — it will appear after admin approval');
      setReviewForm({ reviewerName: '', rating: 5, comment: '' });
    } catch (err) {
      console.error('Review error', err);
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="relative h-96">
          <img 
            src={pkg.coverImage || 'https://images.unsplash.com/photo-1502920916112-5a85a8d2d7c6?w=1200'} 
            alt={pkg.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl sm:text-4xl font-bold">{pkg.name}</h1>
              <div className="flex items-center justify-center gap-4 mt-2 text-sm sm:text-base">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {pkg.destinationId?.name || 'Destination'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {pkg.durationDays} Days
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">About This Trip</h2>
                <p className="text-gray-600 mt-2">{pkg.description}</p>
              </div>

              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Itinerary</h3>
                  <div className="space-y-4">
                    {pkg.itinerary.map((day, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">Day {day.day}: {day.title}</h4>
                        <p className="text-gray-600 mt-1 text-sm">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pkg.includes && pkg.includes.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What's Included</h3>
                  <div className="flex flex-wrap gap-2">
                    {pkg.includes.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pkg.excludes && pkg.excludes.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What's Not Included</h3>
                  <div className="flex flex-wrap gap-2">
                    {pkg.excludes.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Customize Your Trip</h3>
                <CustomizerPanel 
                  packageData={pkg} 
                  providers={providersData} 
                  addOns={addOnsData} 
                />
              </div>
              <div className="mt-8 bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
                <p className="text-sm text-gray-500 mb-3">Your review will be visible after admin approval.</p>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={reviewForm.reviewerName} onChange={(e) => handleReviewChange('reviewerName', e.target.value)} placeholder="Your name" className="px-3 py-2 border rounded" />
                    <select value={reviewForm.rating} onChange={(e) => handleReviewChange('rating', Number(e.target.value))} className="px-3 py-2 border rounded">
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} stars</option>)}
                    </select>
                  </div>
                  <div>
                    <textarea value={reviewForm.comment} onChange={(e) => handleReviewChange('comment', e.target.value)} rows={3} placeholder="Write your review" className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded">Submit Review</button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <div className="text-2xl font-bold text-primary-500 mb-4">
                  From ₹{pkg.basePrice?.toLocaleString() || 0}
                  <span className="text-sm font-normal text-gray-500"> / person</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Guests</span>
                  <div className="flex items-center gap-2">
                    {Array.isArray(siteSettings?.guestOptions) && siteSettings.guestOptions.length > 0 ? (
                      <select value={state.guests} onChange={(e) => handleGuestSelect(e.target.value)} className="px-3 py-2 border rounded">
                        {siteSettings.guestOptions.map(opt => (
                          <option key={opt} value={opt} disabled={pkg.maxGuests && opt > pkg.maxGuests}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <button
                          onClick={() => handleGuestChange(-1)}
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{state.guests}</span>
                        <button
                          onClick={() => handleGuestChange(1)}
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {pkg.maxGuests && state.guests > pkg.maxGuests && (
                  <div className="text-sm text-red-600 font-medium mb-2">Selected guests exceed package maximum of {pkg.maxGuests}</div>
                )}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price ({state.guests} × ₹{pkg.basePrice})</span>
                    <span>₹{((pkg.basePrice || 0) * state.guests).toLocaleString()}</span>
                  </div>
                  {state.selectedHotel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{state.selectedHotel.name} ({pkg.durationDays} days)</span>
                      <span>₹{((state.selectedHotel.pricePerDay || 0) * pkg.durationDays).toLocaleString()}</span>
                    </div>
                  )}
                  {state.selectedCab && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{state.selectedCab.name} ({pkg.durationDays} days)</span>
                      <span>₹{((state.selectedCab.pricePerDay || 0) * pkg.durationDays).toLocaleString()}</span>
                    </div>
                  )}
                  {state.selectedGuide && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{state.selectedGuide.name} ({pkg.durationDays} days)</span>
                      <span>₹{((state.selectedGuide.pricePerDay || 0) * pkg.durationDays).toLocaleString()}</span>
                    </div>
                  )}
                  {state.selectedAddOns.map(addon => (
                    <div key={addon._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{addon.label}</span>
                      <span>₹{(addon.priceType === 'perDay' ? addon.price * pkg.durationDays : addon.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={handleOpenBooking} className="w-full mt-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors">
                  Book This Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseBooking}></div>
          <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-lg mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Book: {pkg.name}</h3>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Travel Date</label>
                <input type="date" required value={bookingForm.travelDate} onChange={(e) => handleBookingChange('travelDate', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Guests</label>
                  <input type="number" min="1" value={state.guests} readOnly className="w-full px-3 py-2 border rounded bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Contact Phone</label>
                  <input required value={bookingForm.contactPhone} onChange={(e) => handleBookingChange('contactPhone', e.target.value)} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Name</label>
                <input required value={bookingForm.contactName} onChange={(e) => handleBookingChange('contactName', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Email (optional)</label>
                <input type="email" value={bookingForm.contactEmail} onChange={(e) => handleBookingChange('contactEmail', e.target.value)} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Special Requests</label>
                <textarea value={bookingForm.specialRequests} onChange={(e) => handleBookingChange('specialRequests', e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={handleCloseBooking} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default PackageDetailPage;