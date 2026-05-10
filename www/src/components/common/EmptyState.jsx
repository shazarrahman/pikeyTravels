import { Link } from 'react-router-dom';
import { Package, Users, MapPin, Star, FileText, Inbox } from 'lucide-react';

const icons = {
  package: Package,
  users: Users,
  map: MapPin,
  star: Star,
  file: FileText,
  default: Inbox
};

export const EmptyState = ({ 
  type = 'default',
  title = 'Nothing here yet',
  description = 'There are no items to display.',
  actionLabel,
  actionLink,
  className = ''
}) => {
  const Icon = icons[type] || icons.default;
  
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Please try again later.',
  onRetry,
  className = ''
}) => (
  <div className={`text-center py-12 px-4 ${className}`}>
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);