import React from 'react';
import { useBookings } from '../../hooks/useBookings';
import { useNavigate } from 'react-router-dom';

export default function BookingsPage() {
  const navigate = useNavigate();
  const { data: bookings, isLoading, isError } = useBookings();

  if (isLoading) return <div className="py-12 text-center">Loading bookings...</div>;
  if (isError) return <div className="py-12 text-center">Failed to load bookings.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-xl font-semibold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">You have no bookings yet.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <div className="font-medium">{b.packageName || b.serviceName || 'Booking'}</div>
                <div className="text-sm text-gray-500">{b.startDate ? new Date(b.startDate).toLocaleDateString() : ''}</div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm text-gray-500">{b.totalPrice ? `₹${b.totalPrice}` : '—'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}>{b.status}</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center gap-2">
                <button onClick={() => navigate(`/bookings/${b._id}`)} className="px-3 py-1 bg-primary-500 text-white rounded">View</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
