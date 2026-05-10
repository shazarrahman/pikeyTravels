import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDestinations, getDestinationsAdmin, createDestination, updateDestination, deleteDestination } from '../../api/destinations';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, MapPin, Eye, EyeOff, X, ArrowLeft } from 'lucide-react';

function DestinationsManagerPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    description: '',
    highlights: [],
    bestTime: '',
    isActive: true
  });
  const [highlightInput, setHighlightInput] = useState('');

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations', 'admin'],
    queryFn: async () => {
      const res = await getDestinationsAdmin();
      return res.data.data;
    },
    onError: (err) => {
      console.error('Failed to fetch admin destinations:', err?.message || err);
      toast.error('Failed to load admin destinations. Please ensure you are logged in as an admin.');
    }
  });

  const createMutation = useMutation({
    mutationFn: createDestination,
    onSuccess: () => {
      toast.success('Destination created');
      queryClient.invalidateQueries(['destinations', 'admin']);
      closeModal();
    },
    onError: () => toast.error('Failed to create')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDestination(id, data),
    onSuccess: () => {
      toast.success('Destination updated');
      queryClient.invalidateQueries(['destinations', 'admin']);
      closeModal();
    },
    onError: () => toast.error('Failed to update')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDestination,
    onSuccess: () => {
      toast.success('Destination deleted');
      queryClient.invalidateQueries(['destinations', 'admin']);
    },
    onError: () => toast.error('Failed to delete')
  });

  const openModal = (dest = null) => {
    if (dest) {
      setEditingDestination(dest);
      setFormData({
        name: dest.name,
        state: dest.state || '',
        description: dest.description || '',
        highlights: dest.highlights || [],
        bestTime: dest.bestTime || '',
        isActive: dest.isActive !== false
      });
    } else {
      setEditingDestination(null);
      setFormData({ name: '', state: '', description: '', highlights: [], bestTime: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDestination(null);
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDestination) {
      updateMutation.mutate({ id: editingDestination._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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
                <h1 className="text-2xl font-bold text-gray-900">Destinations Manager</h1>
                <p className="text-gray-500 text-sm mt-1">Manage travel destinations</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg"
            >
              <Plus size={18} />
              Add Destination
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-12">Loading...</div>
          ) : destinations?.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No destinations. Add your first!</div>
          ) : (
            destinations?.map(dest => (
              <div key={dest._id} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{dest.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${dest.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {dest.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{dest.state}</p>
                {dest.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dest.highlights.slice(0, 3).map((h, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded">{h}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openModal(dest)} className="flex-1 flex items-center justify-center gap-1 py-1 bg-gray-100 rounded text-sm">
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this destination?')) deleteMutation.mutate(dest._id); }}
                    className="flex-1 flex items-center justify-center gap-1 py-1 bg-red-50 text-red-600 rounded text-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editingDestination ? 'Edit Destination' : 'Add Destination'}</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Jaipur"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Rajasthan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Best Time to Visit</label>
                <input
                  value={formData.bestTime}
                  onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., October - March"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Highlights</label>
                <div className="flex gap-2">
                  <input
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Add highlight (press Enter)"
                  />
                  <button type="button" onClick={addHighlight} className="px-4 py-2 bg-gray-100 rounded-lg">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.highlights.map((h, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm flex items-center gap-1">
                      {h}
                      <button type="button" onClick={() => removeHighlight(i)}>×</button>
                    </span>
                  ))}
                </div>
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

export default DestinationsManagerPage;