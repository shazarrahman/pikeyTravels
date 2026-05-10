import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAddOns, getAddOnsAdmin, createAddOn, updateAddOn, deleteAddOn } from '../../api/addons';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, DollarSign, Calendar, ArrowLeft } from 'lucide-react';

function AddOnManagerPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    priceType: 'flat',
    price: 0,
    showOnFront: true
  });

  const { data: addOns, isLoading } = useQuery({
    queryKey: ['addOns', 'admin'],
    queryFn: async () => {
      const res = await getAddOnsAdmin();
      return res.data.data;
    },
    onError: (err) => {
      console.error('Failed to fetch admin add-ons:', err?.message || err);
      toast.error('Failed to load add-ons. Ensure you are logged in as admin.');
    }
  });

  const createMutation = useMutation({
    mutationFn: createAddOn,
    onSuccess: () => {
      toast.success('Add-on created successfully');
      queryClient.invalidateQueries(['addOns', 'admin']);
      closeModal();
    },
    onError: () => {
      toast.error('Failed to create add-on');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateAddOn(id, data),
    onSuccess: () => {
      toast.success('Add-on updated successfully');
      queryClient.invalidateQueries(['addOns', 'admin']);
      closeModal();
    },
    onError: () => {
      toast.error('Failed to update add-on');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddOn,
    onSuccess: () => {
      toast.success('Add-on deleted');
      queryClient.invalidateQueries(['addOns', 'admin']);
    },
    onError: () => {
      toast.error('Failed to delete add-on');
    }
  });

  const openModal = (addOn = null) => {
    if (addOn) {
      setEditingAddOn(addOn);
      setFormData({
        label: addOn.label,
        description: addOn.description,
        priceType: addOn.priceType,
        price: addOn.price,
        showOnFront: addOn.showOnFront
      });
    } else {
      setEditingAddOn(null);
      setFormData({
        label: '',
        description: '',
        priceType: 'flat',
        price: 0,
        showOnFront: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddOn(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddOn) {
      updateMutation.mutate({ id: editingAddOn._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Add-on Services</h1>
                <p className="text-gray-500 text-sm mt-1">Manage package extras and enhancements</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <Plus size={18} />
              Create Add-on
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Add-on</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {addOns?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No add-ons yet. Create your first add-on service!
                  </td>
                </tr>
              ) : (
                addOns?.map((addon) => (
                  <tr key={addon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{addon.label}</div>
                        <div className="text-sm text-gray-500">{addon.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${addon.priceType === 'perDay' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {addon.priceType === 'perDay' ? 'Per Day' : 'Flat Fee'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">₹{addon.price?.toLocaleString()}</span>
                      {addon.priceType === 'perDay' && <span className="text-gray-500 text-sm">/day</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${addon.showOnFront ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {addon.showOnFront ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(addon)}
                          className="p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this add-on?')) {
                              deleteMutation.mutate(addon._id);
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingAddOn ? 'Edit Add-on' : 'Create Add-on'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Include a Local Guide"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={2}
                  placeholder="Short explanation for users..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="flat">Flat Fee</option>
                  <option value="perDay">Per Day</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showOnFront}
                    onChange={(e) => setFormData({ ...formData, showOnFront: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Show on Package Pages</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50"
                >
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

export default AddOnManagerPage;