import { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useNavigate } from 'react-router-dom';
import { updateNavItems } from '../../api/siteSettings';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, ExternalLink, Link as LinkIcon, ArrowLeft } from 'lucide-react';

function NavigationManagerPage() {
  const navigate = useNavigate();
  const { data: settings, isLoading, refetch } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [navItems, setNavItems] = useState([
    { label: 'Home', path: '/', isVisible: true, order: 0, isExternal: false },
    { label: 'Destinations', path: '/destinations', isVisible: true, order: 1, isExternal: false },
    { label: 'Packages', path: '/packages', isVisible: true, order: 2, isExternal: false },
    { label: 'Contact', path: '/contact', isVisible: true, order: 3, isExternal: false }
  ]);

  useEffect(() => {
    if (settings?.navItems && settings.navItems.length > 0) {
      setNavItems(settings.navItems);
    }
  }, [settings]);

  const handleAddItem = () => {
    const newItem = { label: 'New Link', path: '/', isVisible: true, order: navItems.length, isExternal: false };
    setNavItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (index) => setNavItems(prev => prev.filter((_, i) => i !== index));

  const handleUpdateItem = (index, field, value) => {
    setNavItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleToggleVisibility = (index) => handleUpdateItem(index, 'isVisible', !navItems[index].isVisible);

  const handleSave = async () => {
    setSaving(true);
    try {
      const orderedItems = navItems.map((item, idx) => ({ ...item, order: idx }));
      await updateNavItems(orderedItems);
      toast.success('Navigation saved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to save navigation');
    } finally {
      setSaving(false);
    }
  };

  const moveItem = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === navItems.length - 1) return;
    setNavItems(prev => {
      const updated = [...prev];
      const swapIndex = index + (direction === 'up' ? -1 : 1);
      [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Go back">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Navigation Manager</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your website navigation links</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50">
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Navigation Links</h2>
                <p className="text-gray-500 text-sm mt-1">Reorder, edit, or toggle visibility of nav items</p>
              </div>
              <button onClick={handleAddItem} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Plus size={16} />
                Add Link
              </button>
            </div>
          </div>

          <div className="p-6">
            {navItems.length === 0 ? (
              <div className="text-center py-12">
                <LinkIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No navigation items yet. Add your first link.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {navItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border hover:border-primary-300 transition-colors">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed">▲</button>
                      <button onClick={() => moveItem(index, 'down')} disabled={index === navItems.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed">▼</button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                        <input type="text" value={item.label} onChange={(e) => handleUpdateItem(index, 'label', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Link Label" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Path {item.isExternal && '(External URL)'}</label>
                        <input type="text" value={item.path} onChange={(e) => handleUpdateItem(index, 'path', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder={item.isExternal ? 'https://example.com' : '/page'} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={item.isExternal} onChange={(e) => handleUpdateItem(index, 'isExternal', e.target.checked)} className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                            <span className="text-sm text-gray-600">External</span>
                          </label>
                          <ExternalLink size={14} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" checked={item.isVisible} onChange={() => handleToggleVisibility(index)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-500 transition-colors"></div>
                          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
                        </div>
                        <span className="text-sm text-gray-600">{item.isVisible ? 'Visible' : 'Hidden'}</span>
                      </label>
                      <button onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <h3 className="font-medium text-gray-900 mb-3">Mobile Menu Preview</h3>
            <div className="bg-white rounded-lg border p-4 max-w-xs">
              <div className="text-sm font-medium text-gray-700 mb-2">Hamburger Menu</div>
              <div className="space-y-2">
                {navItems.filter(item => item.isVisible).map((item, index) => (
                  <div key={index} className="flex items-center gap-2 py-2 px-3 bg-gray-100 rounded text-sm text-gray-700">
                    {item.isExternal && <ExternalLink size={12} className="text-gray-400" />}
                    {item.label}
                  </div>
                ))}
                <div className="flex items-center gap-2 py-2 px-3 bg-accent-100 rounded text-sm text-accent-700">List Your Hotel/Cab/Guide</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationManagerPage;