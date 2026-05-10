import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { loginProvider } from '../../api/providers';
import toast from 'react-hot-toast';
import { Building2, Car, User, Mail, Lock, Eye, EyeOff, Calendar, DollarSign, Package } from 'lucide-react';

function ProviderLoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginProvider,
    onSuccess: (res) => {
      localStorage.setItem('pikey_provider_token', res.data.token);
      localStorage.setItem('pikey_provider', JSON.stringify(res.data.data));
      toast.success('Login successful!');
      navigate('/provider/dashboard');
    },
    onError: (err) => {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || 'Invalid credentials';
      if (status === 403) {
        toast.error(msg);
        // If registration is pending, take user to pending page
        if (msg.toLowerCase().includes('pending')) {
          navigate('/provider/pending');
        } else if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('rejected')) {
          // If rejected, take user to registration so they can resubmit (prefill will be used if available)
          navigate('/provider');
        }
      } else {
        toast.error(msg);
      }
    }
  });

  const onSubmit = (data) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Provider Login</h1>
              <p className="text-gray-500 mt-1">Login to manage your listings</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: true })}
                    className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isLoading}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg disabled:opacity-50"
              >
                {loginMutation.isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Don't have an account?{' '}
              <a href="/provider" className="text-primary-500 hover:underline">Register here</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProviderLoginPage;