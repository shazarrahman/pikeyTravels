import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { createProvider, checkProviderByEmail } from '../../api/providers';
import toast from 'react-hot-toast';
import { useCategories } from '../../hooks/useCategories';
import { Hotel, Upload, Phone, MapPin, FileText } from 'lucide-react';

function HotelRegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [images, setImages] = useState([]);
  const [idProof, setIdProof] = useState(null);
  const imagesInputRef = useRef(null);
  const idProofInputRef = useRef(null);

  const { data: categories } = useCategories('hotel');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pikey_last_provider_submission');
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.type === 'hotel') {
          setValue('name', obj.name || '');
          setValue('email', obj.email || '');
          setValue('location', obj.location || '');
          setValue('contactNumber', obj.contactNumber || '');
          setValue('description', obj.description || '');
          if (obj.categoryId) setValue('categoryId', obj.categoryId);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [setValue]);

  const [providerStatus, setProviderStatus] = useState(null);
  const [providerData, setProviderData] = useState(null);

  // if logged-in as a user, check if there's an existing provider with same email
  useEffect(() => {
    const rawUser = localStorage.getItem('pikey_user');
    if (!rawUser) return;
    try {
      const usr = JSON.parse(rawUser);
      if (usr && usr.email) {
        checkProviderByEmail(usr.email)
          .then(res => {
            const p = res?.data?.data;
            if (p) {
              setProviderData(p);
              setProviderStatus(p.status);
            }
          })
          .catch(() => {});
      }
    } catch (e) {}
  }, []);

  const createMutation = useMutation({
    mutationFn: createProvider,
    onSuccess: () => {
      toast.success('Hotel registered successfully! We will review your request.');
      queryClient.invalidateQueries({ queryKey: ['providers', 'admin'] });
      navigate('/provider/pending');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err.message || 'Failed to register hotel';
      if (msg.includes('Cast to ObjectId failed') || msg.toLowerCase().includes('categoryid')) {
        toast.error('Invalid category selected. Please choose a category from the list.');
      } else if (msg.toLowerCase().includes('idproofurl') || msg.includes('Cast to string failed')) {
        toast.error('ID proof upload failed. Please re-upload a valid file (jpg, png, pdf).');
      } else {
        toast.error(msg);
      }
    }
  });

  const onSubmit = (data) => {
    // save last submission (files omitted) so rejected providers can resubmit
    try {
      const save = { type: 'hotel', name: data.name, email: data.email, location: data.location, contactNumber: data.contactNumber, description: data.description, categoryId: data.categoryId };
      localStorage.setItem('pikey_last_provider_submission', JSON.stringify(save));
    } catch (e) {}
    const formData = new FormData();
    formData.append('type', 'hotel');
    formData.append('name', data.name);
    formData.append('categoryId', data.categoryId);
    formData.append('contactNumber', data.contactNumber);
    formData.append('description', data.description);
    formData.append('location', data.location);
    
    if (images.length > 0) {
      images.forEach(img => formData.append('images', img));
    }
    if (idProof) {
      formData.append('idProofUrl', idProof);
    }
    
    createMutation.mutate(formData);
  };

  if (providerStatus === 'pending') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold">Request Pending</h2>
              <p className="mt-4 text-gray-600">Your provider registration is currently pending review. We'll notify you once it's reviewed.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  if (providerStatus === 'approved') {
    // if provider is approved, ensure they are logged in first
    const provToken = localStorage.getItem('pikey_provider_token');
    if (!provToken) {
      navigate('/provider/login');
      return null;
    }
    // already logged-in provider -> go to dashboard
    window.location.href = '/provider/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Hotel size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Register Your Hotel</h1>
                <p className="text-gray-500">Fill in your hotel details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Taj Palace Hotel"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">Hotel name is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="hotel@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  {...register('password', { required: true, minLength: 6 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  {...register('categoryId', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Category</option>
                  {categories && categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))
                  ) : (
                    <option disabled>Loading categories...</option>
                  )}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">Category is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                <input
                  {...register('contactNumber', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+91 98765 43210"
                />
                {errors.contactNumber && <p className="text-red-500 text-sm mt-1">Contact number is required</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Area *</label>
                <input
                  {...register('location', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Gomti Nagar, Lucknow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your hotel..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Images</label>
                <div onClick={() => imagesInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 mt-2">Click to upload images</p>
                  <input ref={imagesInputRef} onChange={(e) => setImages(Array.from(e.target.files))} type="file" multiple accept="image/*" className="hidden" />
                </div>
                {images.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {images.map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} alt={f.name} className="h-20 rounded" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID / Business Proof *</label>
                <div onClick={() => idProofInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
                  <FileText className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 mt-2">Upload business license or ID proof</p>
                  <input ref={idProofInputRef} onChange={(e) => setIdProof(e.target.files && e.target.files[0])} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                </div>
                {idProof && (
                  <div className="mt-3 text-sm text-gray-600">Selected: {idProof.name}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {createMutation.isLoading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HotelRegisterPage;