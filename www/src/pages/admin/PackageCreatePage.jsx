import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPackageById, createPackage, updatePackage } from '../../api/packages';
import { getDestinations, getDestinationsAdmin } from '../../api/destinations';
import { getProviders, getProvidersAdmin } from '../../api/providers';
import { getCategories } from '../../api/categories';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Save, Image, MapPin, Hotel, Car, User, Calendar } from 'lucide-react';

function PackageCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }]);
  const [includes, setIncludes] = useState([]);
  const [excludes, setExcludes] = useState([]);
  const [selectedAltHotels, setSelectedAltHotels] = useState([]);
  const [selectedAltCabs, setSelectedAltCabs] = useState([]);
  const [selectedAltGuides, setSelectedAltGuides] = useState([]);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      destinationId: '',
      durationDays: 3,
      coverImage: '',
      basePrice: 0,
      configuredPrice: '',
      maxGuests: 10,
      description: '',
      defaultHotelId: '',
      defaultCabId: '',
      defaultGuideId: '',
      showOnFront: false,
      isFeatured: false,
    }
  });

  const { data: destinations, isLoading: loadingDestinations } = useQuery({
    queryKey: ['destinations', 'admin'],
    queryFn: async () => {
      const res = await getDestinationsAdmin();
      return res.data.data;
    },
    onError: (err) => {
      console.error('Failed to fetch admin destinations:', err?.message || err);
      toast.error('Failed to load destinations. Ensure you are logged in as admin.');
    }
  });

  const { data: providers } = useQuery({
    queryKey: ['providers', 'admin'],
    queryFn: async () => {
      const res = await getProvidersAdmin();
      return res.data.data;
    },
    onError: (err) => {
      console.error('Failed to fetch admin providers:', err?.message || err);
      toast.error('Failed to load providers. Ensure you are logged in as admin.');
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await getCategories();
      return res.data.data;
    }
  });

  const hotels = providers?.filter(p => p.type === 'hotel' && p.status === 'approved') || [];
  const cabs = providers?.filter(p => p.type === 'cab' && p.status === 'approved') || [];
  const guides = providers?.filter(p => p.type === 'guide' && p.status === 'approved') || [];

  const createMutation = useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      toast.success('Package created successfully');
      queryClient.invalidateQueries(['packages', 'admin']);
      navigate('/admin/packages');
    },
    onError: () => {
      toast.error('Failed to create package');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ data }) => updatePackage(id, data),
    onSuccess: () => {
      toast.success('Package updated successfully');
      queryClient.invalidateQueries(['packages', 'admin']);
      navigate('/admin/packages');
    },
    onError: () => {
      toast.error('Failed to update package');
    }
  });

  useEffect(() => {
    if (isEdit) {
      getPackageById(id).then(res => {
        const pkg = res.data.data;
        reset({
          name: pkg.name,
          destinationId: pkg.destinationId?._id || pkg.destinationId || '',
          durationDays: pkg.durationDays,
          coverImage: pkg.coverImage,
          basePrice: pkg.basePrice,
          configuredPrice: pkg.configuredPrice || '',
          maxGuests: pkg.maxGuests || 10,
          description: pkg.description,
          defaultHotelId: pkg.defaultHotelId?._id || pkg.defaultHotelId || '',
          defaultCabId: pkg.defaultCabId?._id || pkg.defaultCabId || '',
          defaultGuideId: pkg.defaultGuideId?._id || pkg.defaultGuideId || '',
          showOnFront: pkg.showOnFront,
          isFeatured: pkg.isFeatured,
        });
        setItinerary(pkg.itinerary || [{ day: 1, title: '', description: '' }]);
        setIncludes(pkg.includes || []);
        setExcludes(pkg.excludes || []);
        setSelectedAltHotels(pkg.altHotels || []);
        setSelectedAltCabs(pkg.altCabs || []);
        setSelectedAltGuides(pkg.altGuides || []);
      });
    }
  }, [isEdit, id]);

  const onSubmit = (data) => {
    const packageData = {
      ...data,
      itinerary,
      includes,
      excludes,
      altHotels: selectedAltHotels,
      altCabs: selectedAltCabs,
      altGuides: selectedAltGuides,
    };

    if (isEdit) {
      updateMutation.mutate({ data: packageData });
    } else {
      createMutation.mutate(packageData);
    }
  };

  const addItineraryDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
  };

  const updateItinerary = (index, field, value) => {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  };

  const removeItinerary = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const handleIncludeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value) {
        setIncludes([...includes, value]);
        e.target.value = '';
      }
    }
  };

  const handleExcludeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value) {
        setExcludes([...excludes, value]);
        e.target.value = '';
      }
    }
  };

  const toggleProvider = (list, setList, provider) => {
    const exists = list.find(p => p._id === provider._id);
    if (exists) {
      setList(list.filter(p => p._id !== provider._id));
    } else {
      setList([...list, provider]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/admin/packages" className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Edit Package' : 'Create Package'}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {isEdit ? 'Update package details' : 'Add a new travel package'}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Package'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Golden Triangle - 3 Days"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <select
                      {...register('destinationId', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Destination</option>
                      {destinations?.map(dest => (
                        <option key={dest._id} value={dest._id}>{dest.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      {...register('durationDays', { required: true, min: 1 })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                    <input
                      {...register('coverImage')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe the package..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (INR)</label>
                    <input
                      type="number"
                      {...register('basePrice', { required: true, min: 0 })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                    <input
                      type="number"
                      {...register('maxGuests', { required: false, min: 1 })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Configured Price (optional override)</label>
                    <input
                      type="number"
                      {...register('configuredPrice')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Leave empty to use base price"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {itinerary.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Day {item.day}</span>
                        {itinerary.length > 1 && (
                          <button type="button" onClick={() => removeItinerary(index)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <input
                        value={item.title}
                        onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg mb-2"
                        placeholder="Day title (e.g., Arrival in Delhi)"
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={2}
                        placeholder="Description..."
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="flex items-center gap-2 text-primary-500 hover:text-primary-700"
                  >
                    <Plus size={16} />
                    Add Day
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Included / Not Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Included (Press Enter to add)</label>
                    <input
                      onKeyPress={handleIncludeKeyPress}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Breakfast"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {includes.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                          {item}
                          <button type="button" onClick={() => setIncludes(includes.filter((_, i) => i !== index))} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Not Included (Press Enter to add)</label>
                    <input
                      onKeyPress={handleExcludeKeyPress}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Airfare"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {excludes.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                          {item}
                          <button type="button" onClick={() => setExcludes(excludes.filter((_, i) => i !== index))} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Default Selections</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Hotel</label>
                    <select
                      {...register('defaultHotelId')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Hotel (Optional)</option>
                      {hotels.map(hotel => (
                        <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Cab</label>
                    <select
                      {...register('defaultCabId')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Cab (Optional)</option>
                      {cabs.map(cab => (
                        <option key={cab._id} value={cab._id}>{cab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guide (Optional)</label>
                    <select
                      {...register('defaultGuideId')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">No Guide</option>
                      {guides.map(guide => (
                        <option key={guide._id} value={guide._id}>{guide.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Alternative Options</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Hotels</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {hotels.map(hotel => (
                        <label key={hotel._id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAltHotels.some(h => h._id === hotel._id)}
                            onChange={() => toggleProvider(selectedAltHotels, setSelectedAltHotels, hotel)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{hotel.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Cabs</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cabs.map(cab => (
                        <label key={cab._id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAltCabs.some(c => c._id === cab._id)}
                            onChange={() => toggleProvider(selectedAltCabs, setSelectedAltCabs, cab)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{cab.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Guides</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {guides.map(guide => (
                        <label key={guide._id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAltGuides.some(g => g._id === guide._id)}
                            onChange={() => toggleProvider(selectedAltGuides, setSelectedAltGuides, guide)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{guide.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Visibility</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('showOnFront')} className="rounded border-gray-300" />
                    <span className="text-sm">Show on Front Website</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('isFeatured')} className="rounded border-gray-300" />
                    <span className="text-sm">Mark as Featured</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PackageCreatePage;