import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Star, MapPin, Settings, LogOut, FileText, DollarSign, Menu, Navigation, PlusCircle, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin', active: location.pathname === '/superadmin' },
    { icon: Navigation, label: 'Navigation', path: '/superadmin/navigation', active: location.pathname === '/superadmin/navigation' },
    { icon: Package, label: 'Packages', path: '/superadmin/packages', active: location.pathname === '/superadmin/packages' },
    { icon: PlusCircle, label: 'Add-ons', path: '/superadmin/addons', active: location.pathname === '/superadmin/addons' },
    { icon: Users, label: 'Providers', path: '/superadmin/providers', active: location.pathname === '/superadmin/providers' },
    { icon: Star, label: 'Reviews', path: '/superadmin/reviews', active: location.pathname === '/superadmin/reviews' },
    { icon: FileText, label: 'Bookings', path: '/superadmin/bookings', active: location.pathname === '/superadmin/bookings' },
    { icon: MapPin, label: 'Destinations', path: '/superadmin/destinations', active: location.pathname === '/superadmin/destinations' },
    { icon: FileText, label: 'Categories', path: '/superadmin/categories', active: location.pathname === '/superadmin/categories' },
    { icon: Settings, label: 'Settings', path: '/superadmin/settings', active: location.pathname === '/superadmin/settings' }
  ];

  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const adminToken = localStorage.getItem('pikey_token');
        const res = await axios.get('/api/admin/dashboard', {
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
        });
        if (mounted && res?.data?.success) {
          const d = res.data.data;
          setStats([
            { label: 'Total Providers', value: String(d.totalProviders || 0), color: 'bg-blue-500' },
            { label: 'Active Packages', value: String(d.activePackages || 0), color: 'bg-green-500' },
            { label: 'Total Bookings', value: String(d.totalBookings || 0), color: 'bg-orange-500' },
            { label: 'Revenue', value: `₹${(d.revenue || 0).toLocaleString()}`, color: 'bg-purple-500' }
          ]);
          setPendingRequests((d.pendingProviders || []).map(p => ({ type: p.type || 'Provider', name: p.name || 'Unnamed', date: p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : '-' })));
        }
      } catch (err) {
        console.error('admin dashboard load error', err && err.response ? err.response.data : err);
        if (err?.response?.status === 403) {
          // Admin access required — redirect to login for admin
          window.location.href = '/login';
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark-900 text-white transition-all duration-300 flex flex-col`}> 
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <span className="text-xl font-bold">Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded">
            <ChevronLeft className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <nav className="mt-4 flex-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 ${item.active ? 'bg-primary-500' : ''}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className={`flex items-center ${sidebarOpen ? 'gap-3 px-4 text-left justify-start' : 'justify-center'} py-3 hover:bg-white/10 w-full rounded`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <div className="col-span-1 md:col-span-4 text-center py-10">Loading...</div>
          ) : (
            (stats || []).map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold">{String(stat.value)[0]}</span>
                </div>
                <h3 className="font-semibold text-gray-800">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.length === 0 && !loading ? (
              <div className="text-sm text-gray-500">No pending requests</div>
            ) : (
              pendingRequests.map((req, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{req.name}</p>
                    <p className="text-sm text-gray-500">{req.type} • {req.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Pending</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;