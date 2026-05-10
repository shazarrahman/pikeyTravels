import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPackages, getPackagesAdmin, deletePackage, updatePackage } from '../../api/packages';
import { getDestinations, getDestinationsAdmin } from '../../api/destinations';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, MapPin, ArrowLeft } from 'lucide-react';

function PackageManagerPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages', 'admin'],
    queryFn: async () => {
      const res = await getPackagesAdmin();
      return res.data.data;
    },
    onError: (err) => {
      console.error('Failed to fetch admin packages:', err?.message || err);
      toast.error('Failed to load packages. Ensure you are logged in as admin.');
    }
  });

  const { data: destinations } = useQuery({
    queryKey: ['destinations', 'admin'],
    queryFn: async () => {
      const res = await getDestinationsAdmin();
      return res.data.data;
    },
    onError: (err) => {
      console.error('Failed to fetch admin destinations for packages page:', err?.message || err);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      toast.success('Package deleted');
      queryClient.invalidateQueries(['packages', 'admin']);
    },
    onError: () => {
      toast.error('Failed to delete package');
    }
  });

  const filteredPackages = packages?.filter(pkg => {
    if (filter === 'all') return true;
    if (filter === 'featured') return pkg.isFeatured;
    if (filter === 'visible') return pkg.showOnFront;
    if (filter === 'hidden') return !pkg.showOnFront;
    return true;
  }) || [];

  const getDestinationName = (id) => {
    const dest = destinations?.find(d => d._id === id);
    return dest?.name || 'Unknown';
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
                <h1 className="text-2xl font-bold text-gray-900">Package Manager</h1>
                <p className="text-gray-500 text-sm mt-1">Manage travel packages</p>
              </div>
            </div>
            <Link
              to="/admin/packages/create"
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <Plus size={18} />
              Create Package
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All ({packages?.length || 0})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-lg text-sm ${filter === 'featured' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Featured
            </button>
            <button
              onClick={() => setFilter('visible')}
              className={`px-4 py-2 rounded-lg text-sm ${filter === 'visible' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Visible
            </button>
            <button
              onClick={() => setFilter('hidden')}
              className={`px-4 py-2 rounded-lg text-sm ${filter === 'hidden' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Hidden
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No packages found. Create your first package!
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.coverImage || 'https://via.placeholder.com/100x60'}
                            alt={pkg.name}
                            className="w-20 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{pkg.name}</span>
                              {pkg.isFeatured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1">{pkg.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin size={14} />
                          {getDestinationName(pkg.destinationId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{pkg.durationDays} Days</td>
                      <td className="px-6 py-4">
                        {typeof pkg.configuredPrice === 'number' ? (
                          <div>
                            <div className="text-sm text-gray-500 line-through">₹{pkg.basePrice?.toLocaleString()}</div>
                            <div className="font-medium text-gray-900">₹{pkg.configuredPrice?.toLocaleString()}</div>
                          </div>
                        ) : (
                          <span className="font-medium text-gray-900">₹{pkg.basePrice?.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${pkg.showOnFront ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {pkg.showOnFront ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/packages/${pkg._id}`}
                            target="_blank"
                            className="p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/admin/packages/edit/${pkg._id}`}
                            className="p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => {
                              const payload = { showOnFront: !pkg.showOnFront };
                              if (confirm(`Set package "${pkg.name}" to ${pkg.showOnFront ? 'Hidden' : 'Visible'} on frontend?`)) {
                                // reuse updatePackage endpoint
                                updatePackage(pkg._id, payload).then(() => {
                                  toast.success('Visibility updated');
                                  queryClient.invalidateQueries(['packages', 'admin']);
                                }).catch(() => toast.error('Failed to update visibility'));
                              }
                            }}
                            className="p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded"
                          >
                            {pkg.showOnFront ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this package?')) {
                                deleteMutation.mutate(pkg._id);
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
      </div>
    </div>
  );
}

export default PackageManagerPage;
