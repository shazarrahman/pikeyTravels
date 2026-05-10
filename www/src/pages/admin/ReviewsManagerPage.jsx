import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getReviewsAdmin, approveReview, rejectReview, toggleReviewVisibility, deleteReview } from '../../api/reviews';
import toast from 'react-hot-toast';
import { Star, Check, X, Eye, EyeOff, ArrowLeft, Trash2 } from 'lucide-react';

function ReviewsManagerPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedReview, setSelectedReview] = useState(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', 'admin'],
    queryFn: async () => {
      const res = await getReviewsAdmin();
      return res.data.data;
    },
    onError: (err) => {
      console.error('Failed to fetch admin reviews:', err?.message || err);
      toast.error('Failed to load reviews. Ensure you are logged in as admin.');
    }
  });

  const approveMutation = useMutation({
    mutationFn: approveReview,
    onSuccess: () => {
      toast.success('Review approved');
      queryClient.invalidateQueries(['reviews', 'admin']);
      queryClient.invalidateQueries(['reviews']);
    },
    onError: () => toast.error('Failed to approve')
  });

  const rejectMutation = useMutation({
    mutationFn: rejectReview,
    onSuccess: () => {
      toast.success('Review rejected');
      queryClient.invalidateQueries(['reviews', 'admin']);
      queryClient.invalidateQueries(['reviews']);
    },
    onError: () => toast.error('Failed to reject')
  });

  const toggleMutation = useMutation({
    mutationFn: toggleReviewVisibility,
    onSuccess: () => {
      toast.success('Visibility updated');
      queryClient.invalidateQueries(['reviews', 'admin']);
      queryClient.invalidateQueries(['reviews']);
    },
    onError: () => toast.error('Failed to update visibility')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries(['reviews', 'admin']);
      queryClient.invalidateQueries(['reviews']);
    },
    onError: () => toast.error('Failed to delete review')
  });

  const pending = reviews?.filter(r => r.status === 'pending') || [];
  const approved = reviews?.filter(r => r.status === 'approved') || [];

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
                <h1 className="text-2xl font-bold text-gray-900">Reviews Manager</h1>
                <p className="text-gray-500 text-sm mt-1">Manage customer reviews and visibility on the site</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* MAIN GRID (FIXED HERE) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PENDING */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-4">Pending ({pending.length})</h2>

            {pending.map(review => (
              <div key={review._id} className="border p-4 rounded-lg mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3>{review.reviewerName}</h3>
                    <p className="text-sm text-gray-500">{review.comment}</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setSelectedReview(review)}>View</button>
                    <button onClick={() => toggleMutation.mutate(review._id)}>
                      {review.showOnFront ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button onClick={() => deleteMutation.mutate(review._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* APPROVED */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-4">Approved ({approved.length})</h2>

            {approved.map(review => (
              <div key={review._id} className="border p-4 rounded-lg mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3>{review.reviewerName}</h3>
                    <p className="text-sm text-gray-500">{review.comment}</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setSelectedReview(review)}>
                      <Eye size={18} />
                    </button>
                    <button onClick={() => toggleMutation.mutate(review._id)}>
                      {review.showOnFront ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button onClick={() => deleteMutation.mutate(review._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* MODAL */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full md:w-3/4 lg:w-1/2 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-lg font-semibold">{selectedReview.reviewerName?.charAt(0) || 'U'}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedReview.reviewerName}</h3>
                    <p className="text-sm text-gray-500 capitalize">{selectedReview.serviceType} · <span className="text-gray-400">{new Date(selectedReview.createdAt).toLocaleDateString()}</span></p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < selectedReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                      ))}
                      <span className="ml-3 text-sm text-gray-600">{selectedReview.rating}/5</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedReview(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4 text-gray-700 leading-relaxed text-sm">
                <p className="italic">"{selectedReview.comment}"</p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                {selectedReview.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => { approveMutation.mutate(selectedReview._id); setSelectedReview(null); }}
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700"
                    >
                      <Check size={16} /> Approve
                    </button>
                    <button
                      onClick={() => { rejectMutation.mutate(selectedReview._id); setSelectedReview(null); }}
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700"
                    >
                      <X size={16} /> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="w-full inline-flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-800 rounded-lg"
                  >
                    Close
                  </button>
                )}

                <button
                  onClick={() => {
                    if (window.confirm('Delete this review? This cannot be undone.')) {
                      deleteMutation.mutate(selectedReview._id);
                      setSelectedReview(null);
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ReviewsManagerPage;