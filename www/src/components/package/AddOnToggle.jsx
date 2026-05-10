import { Check } from 'lucide-react';

function AddOnToggle({ addOn, isSelected, onToggle }) {
  const priceDisplay = addOn.priceType === 'perDay' 
    ? `+₹${addOn.price}/day` 
    : `+₹${addOn.price}`;
  
  return (
    <label 
      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          isSelected 
            ? 'bg-primary-500 border-primary-500' 
            : 'border-gray-300'
        }`}>
          {isSelected && <Check size={12} className="text-white" />}
        </div>
        <div>
          <span className="font-medium text-gray-900">{addOn.label}</span>
          <p className="text-sm text-gray-500">{addOn.description}</p>
        </div>
      </div>
      <span className="text-primary-500 font-semibold">{priceDisplay}</span>
    </label>
  );
}

export default AddOnToggle;