import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategories } from '../../hooks/useCategories';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { createProvider, checkProviderByEmail } from '../../api/providers';
import toast from 'react-hot-toast';
import { Car, Upload, Phone, FileText } from 'lucide-react';

function CabRegisterPage() {
  const navigate = useNavigate();
  const [carImage, setCarImage] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // prefill from last submission if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pikey_last_provider_submission');
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.type === 'cab') {
          setValue('name', obj.name || '');
          setValue('email', obj.email || '');
          setValue('location', obj.location || '');
          setValue('contactNumber', obj.contactNumber || '');
          if (obj.categoryId) setValue('categoryId', obj.categoryId);
          if (obj.seats) setValue('seats', obj.seats);
        }
      }
    } catch (e) {}
  }, [setValue]);

  const { data: categories } = useCategories('cab');

  const createMutation = useMutation({
    mutationFn: createProvider,
    onSuccess: () => {
      toast.success('Cab registered successfully! We will review your request.');
      queryClient.invalidateQueries({ queryKey: ['providers', 'admin'] });
      navigate('/provider/pending');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to register cab');
    }
  });

  const [providerStatus, setProviderStatus] = useState(null);
  const [providerData, setProviderData] = useState(null);

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

  const onSubmit = (data) => {
    try {
      const save = { type: 'cab', name: data.name, email: data.email, location: data.location, contactNumber: data.contactNumber, categoryId: data.categoryId, seats: data.seats };
      localStorage.setItem('pikey_last_provider_submission', JSON.stringify(save));
    } catch (e) {}
    const formData = new FormData();
    formData.append('type', 'cab');
    formData.append('name', data.name);
    formData.append('categoryId', data.categoryId);
    formData.append('contactNumber', data.contactNumber);
    formData.append('location', data.location);
    formData.append('extraFields[seats]', data.seats);
    
    if (carImage) formData.append('images', carImage);
    if (idProof) formData.append('idProofUrl', idProof);
    
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
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Car size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Register Your Cab</h1>
                <p className="text-gray-500">Add your taxi or cab service</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Name / Model *</label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Innova Crysta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="cab@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  {...register('password', { required: true, minLength: 6 })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Category *</label>
                <select {...register('categoryId', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select Category</option>
                  {categories && categories.length > 0 ? (
                    categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))
                  ) : (
                    <option disabled>Loading categories...</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                <input
                  {...register('contactNumber', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats *</label>
                <select {...register('seats', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="6">6 Seats</option>
                  <option value="7">7 Seats</option>
                  <option value="8">8 Seats</option>
                  <option value="12">12 Seats</option>
                  <option value="14">14 Seats</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / City *</label>
                <input
                  {...register('location', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Jaipur, Rajasthan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 mt-2">Upload car photo</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof (Driving License / RC) *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 mt-2">Upload ID proof</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg"
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

export default CabRegisterPage;