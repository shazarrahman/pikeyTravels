import { Check, Star } from 'lucide-react';

function ServiceOptionCard({ service, type, isSelected, onSelect, onRemove }) {
  if (!service) {
    return (
      <button
        onClick={onSelect}
        className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-gray-300 transition-colors"
      >
        <span className="text-gray-400">No {type}</span>
      </button>
    );
  }
  
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 border rounded-xl text-left transition-all ${
        isSelected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{service.name}</span>
            {isSelected && (
              <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                Selected
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
          {service.categoryId && (
            <div className="flex items-center gap-1 mt-2">
              <Star size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">{service.categoryId.name}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <span className="text-primary-500 font-semibold">
            +₹{service.pricePerDay?.toLocaleString()}/day
          </span>
        </div>
      </div>
    </button>
  );
}

export default ServiceOptionCard;