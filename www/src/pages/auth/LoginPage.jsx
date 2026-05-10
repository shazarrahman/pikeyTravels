import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // If already logged in, redirect as a side-effect (not during render)
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  // Get the redirect path from state (set by ProtectedRoute), or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      // Save intended destination to localStorage as fallback
      if (location.state?.from?.pathname) {
        localStorage.setItem('redirect_after_login', location.state.from.pathname);
      }
      console.log('Navigating to:', from);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h1>
            <p className="text-gray-600 text-center mt-2">Sign in to continue</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
              >
                Sign In
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;