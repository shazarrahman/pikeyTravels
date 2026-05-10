export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-primary-500 ${sizeClasses[size]} ${className}`} />
  );
};

export const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <Spinner size="lg" />
    <p className="mt-4 text-gray-500">{message}</p>
  </div>
);

export const LoadingCard = ({ lines = 3 }) => (
  <div className="animate-pulse space-y-4">
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
    ))}
  </div>
);

export const LoadingTable = ({ rows = 5, cols = 4 }) => (
  <div className="animate-pulse">
    <div className="grid gap-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {[...Array(cols)].map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);