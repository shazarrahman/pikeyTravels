import { useState, useEffect } from 'react';
import { useCustomization } from '../../context/CustomizationContext';
import { Hotel, Car, User, X, Check } from 'lucide-react';

function CustomizerPanel({ packageData, providers, addOns }) {
  const { state, dispatch } = useCustomization();
  const [activeTab, setActiveTab] = useState('hotel');

  useEffect(() => {
    if (packageData) {
      // packageData from backend uses defaultHotelId / defaultCabId / defaultGuideId
      dispatch({
        type: 'INITIALIZE',
        payload: {
          defaultHotel: packageData.defaultHotel || packageData.defaultHotelId || null,
          defaultCab: packageData.defaultCab || packageData.defaultCabId || null,
          defaultGuide: packageData.defaultGuide || packageData.defaultGuideId || null,
          includedAddOns: packageData.addOnServices || packageData.includedAddOns || []
        }
      });
    }
  }, [packageData]);

  const hotels = providers?.filter(p => p.type === 'hotel' && p.status === 'approved') || [];
  const cabs = providers?.filter(p => p.type === 'cab' && p.status === 'approved') || [];
  const guides = providers?.filter(p => p.type === 'guide' && p.status === 'approved') || [];
  
  const makeUnique = (arr) => {
    const seen = new Set();
    return (arr || []).filter(item => {
      const id = (item && (item._id || item)) || null;
      if (!id) return false;
      if (seen.has(String(id))) return false;
      seen.add(String(id));
      return true;
    }).map(i => (i && i._id ? i : i));
  };

  const altHotels = makeUnique([...(packageData?.defaultHotel || packageData?.defaultHotelId ? [(packageData.defaultHotel || packageData.defaultHotelId)] : []), ...(packageData?.altHotels || packageData?.altHotelIds || [])]);
  const altCabs = makeUnique([...(packageData?.defaultCab || packageData?.defaultCabId ? [(packageData.defaultCab || packageData.defaultCabId)] : []), ...(packageData?.altCabs || packageData?.altCabIds || [])]);
  const altGuides = makeUnique([...(packageData?.defaultGuide || packageData?.defaultGuideId ? [(packageData.defaultGuide || packageData.defaultGuideId)] : []), ...(packageData?.altGuides || packageData?.altGuideIds || [])]);

  const visibleAddOns = addOns?.filter(a => a.showOnFront) || [];

  const tabs = [
    { id: 'hotel', label: 'Hotel', icon: Hotel },
    { id: 'cab', label: 'Cab', icon: Car },
    { id: 'guide', label: 'Guide', icon: User },
  ];

  const currentOptions = {
    hotel: altHotels,
    cab: altCabs,
    guide: altGuides,
  };

  const selectedItem = {
    hotel: state.selectedHotel,
    cab: state.selectedCab,
    guide: state.selectedGuide,
  };

  const handleSelect = (type, item) => {
    dispatch({ type: `SELECT_${type.toUpperCase()}`, payload: item });
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {activeTab === 'guide' && (
            <button
              onClick={() => handleSelect('guide', null)}
              className={`w-full p-3 border rounded-lg text-left transition-colors ${
                !state.selectedGuide
                  ? 'border-primary-500 bg-primary-50'
                  : 'hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">No Guide</span>
                {!state.selectedGuide && <Check size={16} className="text-primary-500" />}
              </div>
              <p className="text-sm text-gray-500 mt-1">Skip the guide to save money</p>
            </button>
          )}

          {currentOptions[activeTab]?.map(item => (
            <button
              key={item._id}
              onClick={() => handleSelect(activeTab, item)}
              className={`w-full p-3 border rounded-lg text-left transition-colors ${
                selectedItem[activeTab]?._id === item._id
                  ? 'border-primary-500 bg-primary-50'
                  : 'hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                  <div>
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-primary-500 ml-2">+₹{item.priceType === 'perBooking' ? (item.pricePerBooking || 0) : (item.pricePerDay || 0)}{item.priceType === 'perBooking' ? '' : '/day'}</span>
                </div>
                {selectedItem[activeTab]?._id === item._id && (
                  <Check size={16} className="text-primary-500" />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
            </button>
          ))}
        </div>

        {activeTab !== 'guide' && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add-on Services</h4>
            <div className="space-y-2">
              {visibleAddOns?.map(addon => {
                const isSelected = state.selectedAddOns.some(a => a._id === addon._id);
                return (
                  <label
                    key={addon._id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'border-primary-500 bg-primary-50' : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => dispatch({ type: 'TOGGLE_ADDON', payload: addon })}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">{addon.label}</span>
                        <span className="text-primary-500 ml-2">
                          +₹{addon.price}
                          {addon.priceType === 'perDay' && '/day'}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomizerPanel;