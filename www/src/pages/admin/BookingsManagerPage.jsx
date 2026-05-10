import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, getBookingById, updateBookingStatus, deleteBooking } from '../../api/bookings';
import toast from 'react-hot-toast';
import { Package, Calendar, Users, DollarSign, Check, X, Eye, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';

function BookingsManagerPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await getBookings();
      return res.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, { status }),
    onSuccess: () => {
      toast.success('Booking status updated');
      queryClient.invalidateQueries(['bookings']);
    },
    onError: () => toast.error('Failed to update status')
  });

  const filteredBookings = bookings?.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (b._id && b._id.toLowerCase().includes(q)) ||
      (b.contactName && b.contactName.toLowerCase().includes(q)) ||
      (b.contactPhone && b.contactPhone.toLowerCase().includes(q)) ||
      (b.packageId?.name && b.packageId.name.toLowerCase().includes(q))
    );
  }) || [];

  const totalRevenue = filteredBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const statusCounts = {
    pending: bookings?.filter(b => b.status === 'pending').length || 0,
    confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
    cancelled: bookings?.filter(b => b.status === 'cancelled').length || 0,
    completed: bookings?.filter(b => b.status === 'completed').length || 0
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
                <h1 className="text-2xl font-bold text-gray-900">Bookings Manager</h1>
                <p className="text-gray-500 text-sm mt-1">Manage all customer bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div 
            onClick={() => setFilter('pending')}
            className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer ${filter === 'pending' ? 'ring-2 ring-primary-500' : ''}`}
          >
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar size={16} />
              <span className="text-sm">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
          </div>
          <div 
            onClick={() => setFilter('confirmed')}
            className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer ${filter === 'confirmed' ? 'ring-2 ring-primary-500' : ''}`}
          >
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Check size={16} />
              <span className="text-sm">Confirmed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</p>
          </div>
          <div 
            onClick={() => setFilter('completed')}
            className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer ${filter === 'completed' ? 'ring-2 ring-primary-500' : ''}`}
          >
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Package size={16} />
              <span className="text-sm">Completed</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.completed}</p>
          </div>
          <div 
            onClick={() => setFilter('all')}
            className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer ${filter === 'all' ? 'ring-2 ring-primary-500' : ''}`}
          >
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <DollarSign size={16} />
              <span className="text-sm">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Booking ID, customer, phone or package"
            className="px-3 py-2 border rounded w-full max-w-lg"
          />
          <button onClick={() => setSearch('')} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Travel Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center">Loading...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No bookings found</td></tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm text-gray-700">{booking._id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{booking.contactName}</p>
                      <p className="text-sm text-gray-500">{booking.contactPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{booking.packageId?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{booking.guests}</td>
                    <td className="px-4 py-3 font-medium">₹{booking.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{booking.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const res = await getBookingById(booking._id);
                              setSelectedBooking(res.data.data);
                            } catch (err) {
                              console.error('Failed to fetch booking details', err);
                              toast.error('Failed to load booking details');
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-primary-500"
                        >
                          <Eye size={18} />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: booking._id, status: 'confirmed' })}
                              className="p-1 text-green-500 hover:text-green-700"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => updateStatusMutation.mutate({ id: booking._id, status: 'cancelled' })}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)}><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Customer Name</label>
                  <p className="font-medium">{selectedBooking.contactName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{selectedBooking.contactPhone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Travel Date</label>
                  <p>{selectedBooking.travelDate ? new Date(selectedBooking.travelDate).toLocaleDateString() : 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Guests</label>
                  <p>{selectedBooking.guests}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Price</label>
                  <p className="font-bold text-lg">₹{selectedBooking.totalPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className="capitalize">{selectedBooking.status}</p>
                </div>
              </div>
              
              {selectedBooking.selectedAddOns && selectedBooking.selectedAddOns.length > 0 && (
                <div>
                  <label className="text-sm text-gray-500">Selected Add-ons</label>
                  <ul className="list-disc list-inside">
                    {selectedBooking.selectedAddOns.map(s => (
                      <li key={s._id}>{s.addOnId?.name || s.label} x {s.quantity || 1} — ₹{(s.price || s.addOnId?.price || 0).toLocaleString()}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500">Package Defaults vs Customer Selection</label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Default Hotel</span>
                    <span className="font-medium">{selectedBooking.packageId?.defaultHotelId?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Hotel</span>
                    <span className="font-medium">{selectedBooking.selectedHotelId?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Default Cab</span>
                    <span className="font-medium">{selectedBooking.packageId?.defaultCabId?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Cab</span>
                    <span className="font-medium">{selectedBooking.selectedCabId?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Default Guide</span>
                    <span className="font-medium">{selectedBooking.packageId?.defaultGuideId?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Guide</span>
                    <span className="font-medium">{selectedBooking.selectedGuideId?.name || '—'}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div>
                  <label className="text-sm text-gray-500">Special Requests</label>
                  <p>{selectedBooking.specialRequests}</p>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500">Booking ID</label>
                <p className="font-mono text-sm">{selectedBooking._id}</p>
              </div>
              
              {selectedBooking.specialRequests && (
                <div>
                  <label className="text-sm text-gray-500">Special Requests</label>
                  <p>{selectedBooking.specialRequests}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateStatusMutation.mutate({ id: selectedBooking._id, status: 'confirmed' });
                        setSelectedBooking(null);
                      }}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        updateStatusMutation.mutate({ id: selectedBooking._id, status: 'cancelled' });
                        setSelectedBooking(null);
                      }}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      updateStatusMutation.mutate({ id: selectedBooking._id, status: 'completed' });
                      setSelectedBooking(null);
                    }}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsManagerPage;