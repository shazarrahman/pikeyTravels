import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getProviders, getProvidersAdmin, approveProvider, rejectProvider, toggleProviderVisibility, updateProvider } from '../../api/providers';
import toast from 'react-hot-toast';
import { Check, X, Eye, EyeOff, Building2, Car, User, MapPin, Phone, FileText, Image, ArrowLeft } from 'lucide-react';

function ProvidersManagerPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState(null);

  const { data: providers, isLoading } = useQuery({
    queryKey: ['providers', 'admin'],
    queryFn: async () => {
      const res = await getProvidersAdmin();
      return res.data.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: approveProvider,
    onSuccess: () => {
      toast.success('Provider approved');
      queryClient.invalidateQueries(['providers', 'admin']);
    },
    onError: () => toast.error('Failed to approve')
  });

  const rejectMutation = useMutation({
    mutationFn: rejectProvider,
    onSuccess: () => {
      toast.success('Provider rejected and removed');
      queryClient.invalidateQueries(['providers', 'admin']);
    },
    onError: () => toast.error('Failed to reject')
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, show }) => toggleProviderVisibility(id, show),
    onSuccess: () => {
      toast.success('Visibility updated');
      queryClient.invalidateQueries(['providers', 'admin']);
    },
    onError: () => toast.error('Failed to update visibility')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const adminToken = localStorage.getItem('pikey_token');
      return updateProvider(id, data, adminToken);
    },
    onSuccess: (res, vars) => {
      toast.success('Provider updated');
      queryClient.invalidateQueries(['providers', 'admin']);
      // reflect change in UI
      if (vars && vars.id && vars.data) {
        setSelectedProvider(prev => ({ ...prev, ...vars.data }));
      }
    },
    onError: () => toast.error('Failed to update provider')
  });

  const filtered = providers?.filter(p => {
    if (activeTab === 'all') return true;
    return p.type === activeTab;
  }) || [];
  
  const pending = filtered.filter(p => p.status === 'pending');
  const approved = filtered.filter(p => p.status === 'approved');

  const getIcon = (type) => {
    switch (type) {
      case 'hotel': return Building2;
      case 'cab': return Car;
      case 'guide': return User;
      default: return Building2;
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Providers Manager</h1>
                <p className="text-gray-500 text-sm mt-1">Manage hotel, cab, and guide registrations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-2 mb-6">
          {['all','hotel', 'cab', 'guide'].map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === type 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {type === 'hotel' && <Building2 size={18} />}
              {type === 'cab' && <Car size={18} />}
              {type === 'guide' && <User size={18} />}
              <span className="capitalize">{type === 'all' ? 'All' : type === 'hotel' ? 'Hotels' : type === 'cab' ? 'Cabs' : 'Guides'}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {type === 'all' ? (providers?.filter(p => p.status === 'pending').length || 0) : (providers?.filter(p => p.type === type && p.status === 'pending').length || 0)}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Pending Requests ({pending.length})
                </h2>
                {pending.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No pending requests</p>
                ) : (
                  <div className="space-y-3">
                    {pending.map(provider => (
                      <div key={provider._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{provider.name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin size={14} /> {provider.location}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={14} /> {provider.contactNumber}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedProvider(provider)}
                              className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Approved ({approved.length})
                </h2>
                {approved.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No approved providers</p>
                ) : (
                  <div className="space-y-3">
                    {approved.map(provider => (
                      <div key={provider._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{provider.name}</h3>
                            <p className="text-sm text-gray-500">{provider.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleVisibilityMutation.mutate({ 
                                id: provider._id, 
                                show: !provider.showOnFront 
                              })}
                              className={`p-2 rounded ${provider.showOnFront ? 'text-green-500' : 'text-gray-400'}`}
                              title={provider.showOnFront ? 'Shown on front' : 'Hidden from front'}
                            >
                              {provider.showOnFront ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button
                              onClick={() => setSelectedProvider(provider)}
                              className="p-2 text-gray-500 hover:text-primary-500"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedProvider && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Provider Details</h2>
                  <button onClick={() => setSelectedProvider(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>

                {selectedProvider.images?.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {selectedProvider.images.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Provider" 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{selectedProvider.name}</p>
                  </div>
                  {selectedProvider.idProofUrl && (
                    <div>
                      <label className="text-sm text-gray-500">ID Proof</label>
                      <div className="mt-2">
                        {selectedProvider.idProofUrl.match(/\.pdf$/i) ? (
                          <a href={selectedProvider.idProofUrl} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">View ID Proof (PDF)</a>
                        ) : (
                          <img src={selectedProvider.idProofUrl} alt="ID Proof" className="w-48 h-auto rounded border" />
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">Price Type</label>
                    <div className="flex gap-2 mt-1 items-center">
                      <select value={selectedProvider.priceType || 'perDay'} onChange={(e) => setSelectedProvider(prev => ({ ...prev, priceType: e.target.value }))} className="px-3 py-2 border rounded">
                        <option value="perDay">Per Day</option>
                        <option value="perBooking">Per Booking</option>
                      </select>
                      <input
                        type="number"
                        defaultValue={selectedProvider.pricePerDay || 0}
                        onChange={(e) => setSelectedProvider(prev => ({ ...prev, pricePerDay: Number(e.target.value) }))}
                        className="w-32 px-3 py-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Per booking"
                        defaultValue={selectedProvider.pricePerBooking || 0}
                        onChange={(e) => setSelectedProvider(prev => ({ ...prev, pricePerBooking: Number(e.target.value) }))}
                        className="w-32 px-3 py-2 border rounded"
                      />
                      <button
                        onClick={() => updateMutation.mutate({ id: selectedProvider._id, data: { pricePerDay: selectedProvider.pricePerDay || 0, priceType: selectedProvider.priceType || 'perDay', pricePerBooking: selectedProvider.pricePerBooking || 0 } })}
                        disabled={updateMutation.isLoading}
                        className="px-4 py-2 bg-primary-500 text-white rounded"
                      >
                        {updateMutation.isLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Set provider's rate and whether it's charged per day or as a booking fee.</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type</label>
                    <p className="capitalize">{selectedProvider.type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <p className="font-medium">{selectedProvider.location}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Contact</label>
                    <p className="font-medium">{selectedProvider.contactNumber}</p>
                  </div>
                  {selectedProvider.description && (
                    <div>
                      <label className="text-sm text-gray-500">Description</label>
                      <p className="text-sm">{selectedProvider.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className={`capitalize ${
                      selectedProvider.status === 'pending' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{selectedProvider.status}</p>
                  </div>
                </div>

                {selectedProvider.status === 'pending' && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        approveMutation.mutate(selectedProvider._id);
                        setSelectedProvider(null);
                      }}
                      disabled={approveMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <Check size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure? This will permanently delete the request.')) {
                          rejectMutation.mutate(selectedProvider._id);
                          setSelectedProvider(null);
                        }
                      }}
                      disabled={rejectMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <X size={18} />
                      Reject
                    </button>
                  </div>
                )}

                {selectedProvider.status === 'approved' && (
                  <div className="mt-6">
                    <button
                      onClick={() => toggleVisibilityMutation.mutate({ 
                        id: selectedProvider._id, 
                        show: !selectedProvider.showOnFront 
                      })}
                      className={`w-full py-2 rounded-lg ${
                        selectedProvider.showOnFront 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}
                    >
                      {selectedProvider.showOnFront ? 'Hide from Front' : 'Show on Front'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProvidersManagerPage;