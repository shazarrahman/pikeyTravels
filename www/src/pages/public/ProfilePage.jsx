import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../api/users';
import { getCurrentUser } from '../../api/users';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(user._id, data),
    onSuccess: (res) => {
      toast.success('Profile updated');
      queryClient.invalidateQueries(['auth']);
    },
    onError: () => toast.error('Failed to update profile')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-semibold">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="text-xl font-semibold">{user?.name || 'Your Profile'}</h1>
            <p className="text-sm text-gray-500">Manage your account information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary-500" />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={updateMutation.isLoading} className="px-4 py-2 bg-primary-500 text-white rounded">
              {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
