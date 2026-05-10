import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/public/HomePage';
import DestinationsPage from '../pages/public/DestinationsPage';
import PackagesPage from '../pages/public/PackagesPage';
import PackageDetailPage from '../pages/public/PackageDetailPage';
import ContactPage from '../pages/public/ContactPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProviderLandingPage from '../pages/provider/ProviderLandingPage';
import HotelRegisterPage from '../pages/provider/HotelRegisterPage';
import CabRegisterPage from '../pages/provider/CabRegisterPage';
import GuideRegisterPage from '../pages/provider/GuideRegisterPage';
import ProviderLoginPage from '../pages/provider/ProviderLoginPage';
import ProviderDashboardPage from '../pages/provider/ProviderDashboardPage';
import ProviderPendingPage from '../pages/provider/ProviderPendingPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import NavigationManagerPage from '../pages/admin/NavigationManagerPage';
import PackageManagerPage from '../pages/admin/PackageManagerPage';
import PackageCreatePage from '../pages/admin/PackageCreatePage';
import AddOnManagerPage from '../pages/admin/AddOnManagerPage';
import ProvidersManagerPage from '../pages/admin/ProvidersManagerPage';
import ReviewsManagerPage from '../pages/admin/ReviewsManagerPage';
import BookingsManagerPage from '../pages/admin/BookingsManagerPage';
import DestinationsManagerPage from '../pages/admin/DestinationsManagerPage';
import CategoriesManagerPage from '../pages/admin/CategoriesManagerPage';
import SiteSettingsPage from '../pages/admin/SiteSettingsPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import ProfilePage from '../pages/public/ProfilePage';
import BookingsPage from '../pages/public/BookingsPage';
import BookingDetailPage from '../pages/public/BookingDetailPage';

import ProtectedRoute from '../components/auth/ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/destinations" element={<DestinationsPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/packages/:id" element={<PackageDetailPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
      <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
      
      {/* Provider Registration - Landing */}
      <Route path="/provider" element={<ProviderLandingPage />} />
      <Route path="/provider/pending" element={<ProviderPendingPage />} />
      
      {/* Provider Registration Forms */}
      <Route path="/provider/hotel-register" element={<HotelRegisterPage />} />
      <Route path="/provider/cab-register" element={<CabRegisterPage />} />
      <Route path="/provider/guide-register" element={<GuideRegisterPage />} />
      
      {/* Provider Login & Dashboard */}
      <Route path="/provider/login" element={<ProviderLoginPage />} />
      <Route path="/provider/dashboard" element={
        <ProtectedRoute redirectTo="/provider/login">
          <ProviderDashboardPage />
        </ProtectedRoute>
      } />
      
      {/* Super Admin Panel */}
      <Route path="/superadmin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/navigation" element={
        <ProtectedRoute requiredRole="admin">
          <NavigationManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/packages" element={
        <ProtectedRoute requiredRole="admin">
          <PackageManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/packages/create" element={
        <ProtectedRoute requiredRole="admin">
          <PackageCreatePage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/packages/edit/:id" element={
        <ProtectedRoute requiredRole="admin">
          <PackageCreatePage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/addons" element={
        <ProtectedRoute requiredRole="admin">
          <AddOnManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/providers" element={
        <ProtectedRoute requiredRole="admin">
          <ProvidersManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/reviews" element={
        <ProtectedRoute requiredRole="admin">
          <ReviewsManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/bookings" element={
        <ProtectedRoute requiredRole="admin">
          <BookingsManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/destinations" element={
        <ProtectedRoute requiredRole="admin">
          <DestinationsManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/categories" element={
        <ProtectedRoute requiredRole="admin">
          <CategoriesManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/superadmin/settings" element={
        <ProtectedRoute requiredRole="admin">
          <SiteSettingsPage />
        </ProtectedRoute>
      } />
      {/* Backwards-compatible admin routes (alias /admin -> /superadmin) */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/navigation" element={
        <ProtectedRoute requiredRole="admin">
          <NavigationManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/packages" element={
        <ProtectedRoute requiredRole="admin">
          <PackageManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/packages/create" element={
        <ProtectedRoute requiredRole="admin">
          <PackageCreatePage />
        </ProtectedRoute>
      } />
      <Route path="/admin/packages/edit/:id" element={
        <ProtectedRoute requiredRole="admin">
          <PackageCreatePage />
        </ProtectedRoute>
      } />
      <Route path="/admin/addons" element={
        <ProtectedRoute requiredRole="admin">
          <AddOnManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/providers" element={
        <ProtectedRoute requiredRole="admin">
          <ProvidersManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/reviews" element={
        <ProtectedRoute requiredRole="admin">
          <ReviewsManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute requiredRole="admin">
          <BookingsManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/destinations" element={
        <ProtectedRoute requiredRole="admin">
          <DestinationsManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/categories" element={
        <ProtectedRoute requiredRole="admin">
          <CategoriesManagerPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requiredRole="admin">
          <SiteSettingsPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;