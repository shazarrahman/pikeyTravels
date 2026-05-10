import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X, Building2, Car, ArrowLeft, User } from 'lucide-react';

function CategoriesManagerPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'hotel',
    isActive: true
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await getCategories();
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
    onError: () => toast.error('Failed to create')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
    onError: () => toast.error('Failed to update')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast.error('Failed to delete')
  });

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({ name: cat.name, type: cat.type, isActive: cat.isActive !== false });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', type: 'hotel', isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const hotelCategories = categories?.filter(c => c.type === 'hotel') || [];
  const cabCategories = categories?.filter(c => c.type === 'cab') || [];
  const guideCategories = categories?.filter(c => c.type === 'guide') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Categories Manager</h1>
                <p className="text-gray-500 text-sm mt-1">Create categories for hotels and cabs</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-orange-500" />
              <h2 className="text-lg font-bold">Hotel Categories</h2>
            </div>
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : hotelCategories.length === 0 ? (
              <p className="text-gray-500 text-sm">No hotel categories</p>
            ) : (
              <div className="space-y-2">
                {hotelCategories.map(cat => (
                  <div key={cat._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(cat)} className="p-1 text-gray-500 hover:text-primary-500">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteMutation.mutate(cat._id)} className="p-1 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Car size={20} className="text-blue-500" />
              <h2 className="text-lg font-bold">Cab Categories</h2>
            </div>
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : cabCategories.length === 0 ? (
              <p className="text-gray-500 text-sm">No cab categories</p>
            ) : (
              <div className="space-y-2">
                {cabCategories.map(cat => (
                  <div key={cat._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(cat)} className="p-1 text-gray-500 hover:text-primary-500">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteMutation.mutate(cat._id)} className="p-1 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-green-600" />
              <h2 className="text-lg font-bold">Guide Categories</h2>
            </div>
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : guideCategories.length === 0 ? (
              <p className="text-gray-500 text-sm">No guide categories</p>
            ) : (
              <div className="space-y-2">
                {guideCategories.map(cat => (
                  <div key={cat._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(cat)} className="p-1 text-gray-500 hover:text-primary-500">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteMutation.mutate(cat._id)} className="p-1 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Budget Hotel"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="hotel">Hotel</option>
                  <option value="cab">Cab</option>
                  <option value="guide">Guide</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border rounded-lg">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 py-2 bg-primary-500 text-white rounded-lg">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesManagerPage;