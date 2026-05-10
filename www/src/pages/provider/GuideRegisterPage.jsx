import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategories } from '../../hooks/useCategories';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { createProvider, checkProviderByEmail } from '../../api/providers';
import toast from 'react-hot-toast';
import { User, Upload, Phone, FileText, Globe } from 'lucide-react';

function GuideRegisterPage() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [langInput, setLangInput] = useState('');

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { data: categories } = useCategories('guide');

  const createMutation = useMutation({
    mutationFn: createProvider,
    onSuccess: () => {
      toast.success('Guide registered successfully! We will review your request.');
      queryClient.invalidateQueries({ queryKey: ['providers', 'admin'] });
      navigate('/provider/pending');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to register guide');
    }
  });

  const addLanguage = () => {
    if (langInput.trim() && !languages.includes(langInput.trim())) {
      setLanguages([...languages, langInput.trim()]);
      setLangInput('');
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pikey_last_provider_submission');
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.type === 'guide') {
          setValue('name', obj.name || '');
          setValue('email', obj.email || '');
          setValue('location', obj.location || '');
          setValue('contactNumber', obj.contactNumber || '');
          setValue('specialization', obj.specialization || '');
          if (obj.categoryId) setValue('categoryId', obj.categoryId);
          if (Array.isArray(obj.languages)) setLanguages(obj.languages);
        }
      }
    } catch (e) {}
  }, [setValue]);

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

  const removeLanguage = (lang) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  const onSubmit = (data) => {
    try {
      const save = { type: 'guide', name: data.name, email: data.email, location: data.location, contactNumber: data.contactNumber, specialization: data.specialization, categoryId: data.categoryId, languages };
      localStorage.setItem('pikey_last_provider_submission', JSON.stringify(save));
    } catch (e) {}
    const formData = new FormData();
    formData.append('type', 'guide');
    formData.append('name', data.name);
    formData.append('contactNumber', data.contactNumber);
    formData.append('location', data.location);
    formData.append('description', data.about);
    formData.append('extraFields[specialization]', data.specialization);
    if (data.categoryId) formData.append('categoryId', data.categoryId);
    formData.append('extraFields[languages]', JSON.stringify(languages));
    
    if (profilePhoto) formData.append('images', profilePhoto);
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
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Become a Guide</h1>
                <p className="text-gray-500">Share your local expertise</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Rahul Sharma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="guide@example.com"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                <input
                  {...register('specialization', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Rajasthan Heritage Tours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Location *</label>
                <input
                  {...register('location', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Jaipur, Rajasthan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={langInput}
                    onChange={(e) => setLangInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Add language (press Enter)"
                  />
                  <button type="button" onClick={addLanguage} className="px-4 py-2 bg-gray-100 rounded-lg">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                      {lang}
                      <button type="button" onClick={() => removeLanguage(lang)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About / Experience</label>
                <textarea
                  {...register('about')}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Tell travelers about your experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 mt-2">Upload profile photo</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof (Aadhar / Guide License) *</label>
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

export default GuideRegisterPage;