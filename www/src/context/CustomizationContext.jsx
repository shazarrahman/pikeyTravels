import { createContext, useContext, useReducer } from 'react';

const CustomizationContext = createContext();

const initialState = {
  selectedHotel: null,
  selectedCab: null,
  selectedGuide: null,
  // flags to indicate user explicitly chose a provider (including explicit "no" selection)
  selectedHotelExplicit: false,
  selectedCabExplicit: false,
  selectedGuideExplicit: false,
  selectedAddOns: [],
  guests: 2,
  travelDate: null,
};

const customizationReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_HOTEL':
      return { ...state, selectedHotel: action.payload, selectedHotelExplicit: true };
    case 'SELECT_CAB':
      return { ...state, selectedCab: action.payload, selectedCabExplicit: true };
    case 'SELECT_GUIDE':
      return { ...state, selectedGuide: action.payload, selectedGuideExplicit: true };
case 'TOGGLE_ADDON': {
      const exists = state.selectedAddOns.find(a => a._id === action.payload._id);
      return {
        ...state,
        selectedAddOns: exists
          ? state.selectedAddOns.filter(a => a._id !== action.payload._id)
          : [...state.selectedAddOns, action.payload]
      };
    }
    case 'SET_GUESTS':
      return { ...state, guests: action.payload };
    case 'SET_TRAVEL_DATE':
      return { ...state, travelDate: action.payload };
    case 'INITIALIZE':
      return {
        ...initialState,
        selectedHotel: action.payload.defaultHotel || null,
        selectedCab: action.payload.defaultCab || null,
        selectedGuide: action.payload.defaultGuide || null,
        // explicit flags remain false after initialization so defaults are treated as defaults
        selectedHotelExplicit: false,
        selectedCabExplicit: false,
        selectedGuideExplicit: false,
        selectedAddOns: action.payload.includedAddOns || [],
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const CustomizationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customizationReducer, initialState);

  const calculateTotal = (packageData) => {
    if (!packageData) return 0;
    const { durationDays = 1, basePrice = 0, configuredPrice } = packageData;
    const effectiveBase = typeof configuredPrice === 'number' && configuredPrice >= 0 ? configuredPrice : basePrice;

    // provider objects may come from populated package fields or from separate providers list
    const hotel = state.selectedHotelExplicit ? state.selectedHotel : (packageData.defaultHotel || packageData.defaultHotelId || state.selectedHotel);
    const cab = state.selectedCabExplicit ? state.selectedCab : (packageData.defaultCab || packageData.defaultCabId || state.selectedCab);
    const guide = state.selectedGuideExplicit ? state.selectedGuide : (packageData.defaultGuide || packageData.defaultGuideId || state.selectedGuide);
    
    let total = effectiveBase;
    
    // providers can be charged per day or per booking depending on provider settings
    if (hotel) {
      if (hotel.priceType === 'perBooking') {
        total += (hotel.pricePerBooking || 0);
      } else {
        total += (hotel.pricePerDay || 0) * durationDays;
      }
    }

    if (cab) {
      if (cab.priceType === 'perBooking') {
        total += (cab.pricePerBooking || 0);
      } else {
        total += (cab.pricePerDay || 0) * durationDays;
      }
    }

    if (guide) {
      if (guide.priceType === 'perBooking') {
        total += (guide.pricePerBooking || 0);
      } else {
        total += (guide.pricePerDay || 0) * durationDays;
      }
    }
    
    state.selectedAddOns.forEach(addon => {
      if (addon.priceType === 'perDay') {
        total += addon.price * durationDays;
      } else {
        total += addon.price;
      }
    });
    
    // Only the base/configured price is per-person; provider and add-on charges are not multiplied by guests
    const baseOnly = effectiveBase * state.guests;
    const extras = total - effectiveBase; // providers + addons already summed into total above
    return baseOnly + extras;
  };

  const getPriceBreakdown = (packageData) => {
    if (!packageData) return [];
    const { durationDays = 1, basePrice = 0, configuredPrice } = packageData;
    const effectiveBase = typeof configuredPrice === 'number' && configuredPrice >= 0 ? configuredPrice : basePrice;
    
    const breakdown = [
      { label: configuredPrice ? 'Configured Price' : 'Base Price', price: effectiveBase }
    ];
    
    if (state.selectedHotel) {
      breakdown.push({ 
        label: `${state.selectedHotel.name} (${durationDays} days)`, 
        price: state.selectedHotel.priceType === 'perBooking' ? (state.selectedHotel.pricePerBooking || 0) : ((state.selectedHotel.pricePerDay || 0) * durationDays),
        onRemove: () => dispatch({ type: 'SELECT_HOTEL', payload: null })
      });
    }
    
    if (state.selectedCab) {
      breakdown.push({ 
        label: `${state.selectedCab.name} (${durationDays} days)`, 
        price: state.selectedCab.priceType === 'perBooking' ? (state.selectedCab.pricePerBooking || 0) : ((state.selectedCab.pricePerDay || 0) * durationDays),
        onRemove: () => dispatch({ type: 'SELECT_CAB', payload: null })
      });
    }
    
    if (state.selectedGuide) {
      breakdown.push({ 
        label: `${state.selectedGuide.name} (${durationDays} days)`, 
        price: state.selectedGuide.priceType === 'perBooking' ? (state.selectedGuide.pricePerBooking || 0) : ((state.selectedGuide.pricePerDay || 0) * durationDays),
        onRemove: () => dispatch({ type: 'SELECT_GUIDE', payload: null })
      });
    }
    
    state.selectedAddOns.forEach(addon => {
      const price = addon.priceType === 'perDay' ? addon.price * durationDays : addon.price;
      breakdown.push({ label: addon.label, price, onRemove: () => dispatch({ type: 'TOGGLE_ADDON', payload: addon }) });
    });
    
    return breakdown;
  };

  return (
    <CustomizationContext.Provider value={{ state, dispatch, calculateTotal, getPriceBreakdown }}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => useContext(CustomizationContext);
