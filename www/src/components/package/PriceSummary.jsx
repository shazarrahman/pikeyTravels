import { useCustomization } from '../../context/CustomizationContext';
import { X } from 'lucide-react';

function PriceSummary({ packageData }) {
  const { state, calculateTotal, getPriceBreakdown } = useCustomization();
  
  if (!packageData) return null;
  
  const total = calculateTotal(packageData);
  const breakdown = getPriceBreakdown(packageData);
  const duration = packageData.durationDays || 1;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <div className="text-2xl font-bold text-primary-500 mb-4">
        ₹{total.toLocaleString()}
        <span className="text-sm font-normal text-gray-500"> / {state.guests} guest{state.guests > 1 ? 's' : ''}</span>
      </div>
      
      <div className="border-t pt-4 space-y-2">
        {breakdown.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.label}</span>
            <div className="flex items-center gap-2">
              <span>₹{item.price?.toLocaleString()}</span>
              {item.onRemove && (
                <button 
                  onClick={item.onRemove}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
      
      <button className="w-full mt-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors">
        Book This Trip
      </button>
    </div>
  );
}

export default PriceSummary;