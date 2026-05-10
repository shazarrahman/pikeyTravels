import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBookingById } from '../../api/bookings';
import { ArrowLeft } from 'lucide-react';

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id).then(res => res.data.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="py-12 text-center">Loading booking...</div>;
  if (isError || !data) return <div className="py-12 text-center">Booking not found.</div>;

  const b = data;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-2">Booking #{b._id}</h1>
        <p className="text-sm text-gray-500 mb-4">Status: <span className="font-medium">{b.status}</span></p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-500">Customer</label>
            <p className="font-medium">{b.contactName}</p>
            <p className="text-sm text-gray-500">{b.contactEmail}</p>
            <p className="text-sm text-gray-500">{b.contactPhone}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Package</label>
            <p className="font-medium">{b.packageId?.name || '—'}</p>
            <p className="text-sm text-gray-500">{b.guests} guests</p>
            <p className="text-sm text-gray-500">Travel date: {b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'Not set'}</p>
          </div>
        </div>

        {b.selectedAddOns && b.selectedAddOns.length > 0 && (
          <div className="mb-4">
            <label className="text-sm text-gray-500">Add-ons</label>
            <ul className="list-disc list-inside">
              {b.selectedAddOns.map(s => (
                <li key={s._id}>{s.addOnId?.name || 'Addon'} x {s.quantity || 1}</li>
              ))}
            </ul>
          </div>
        )}

        {b.specialRequests && (
          <div className="mb-4">
            <label className="text-sm text-gray-500">Special Requests</label>
            <p>{b.specialRequests}</p>
          </div>
        )}

        <div className="mt-4 border-t pt-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold">₹{b.totalPrice?.toLocaleString() || 0}</div>
          </div>
          <div>
            <button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 rounded">Print</button>
          </div>
        </div>
      </div>
    </div>
  );
}
