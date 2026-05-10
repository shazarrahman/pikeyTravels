import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getSiteSettings, updateSiteSettings, updateBranding, updateHero, updateFooter, updateSections } from '../../api/siteSettings';
import toast from 'react-hot-toast';
import { Save, Palette, Type, Image, Layout, Phone, Mail, MapPin, Globe, ArrowLeft } from 'lucide-react';

function SiteSettingsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('branding');
  const [formData, setFormData] = useState({
    primaryColor: '#f97316',
    secondaryColor: '#0f172a',
    accentColor: '#f59e0b',
    siteName: 'PikeyTravels',
    logoUrl: '',
    primaryFont: 'Inter, sans-serif',
    secondaryFont: 'Playfair Display, serif'
  });
  const [heroData, setHeroData] = useState({
    headline: '',
    subheadline: '',
    ctaLabel: 'Find Packages',
    ctaLink: '/packages',
    backgroundImageUrl: ''
  });
  const [footerData, setFooterData] = useState({
    aboutText: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    youtube: '',
    copyrightText: ''
  });
  const [adminEmailsString, setAdminEmailsString] = useState('');
  const [sectionsData, setSectionsData] = useState({
    packagesSlider: true,
    hotelsSection: true,
    cabsSection: true,
    guidesSection: true,
    reviewsSection: true
  });
  const [siteInfoData, setSiteInfoData] = useState({
    heading: '',
    description: '',
    stats: [
      { label: 'Happy Travelers', value: '500+' },
      { label: 'Destinations', value: '50+' },
      { label: 'Expert Guides', value: '100+' },
      { label: '5-Star Reviews', value: '4.8' }
    ],
    features: [
      'Expert Local Guides',
      'Customized Itineraries',
      '24/7 Customer Support',
      'Best Price Guarantee'
    ],
    isVisible: true
  });
  const [guestOptionsString, setGuestOptionsString] = useState('1,2,3,4');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const res = await getSiteSettings();
      return res.data.data;
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        primaryColor: settings.branding?.primaryColor || '#f97316',
        secondaryColor: settings.branding?.secondaryColor || '#0f172a',
        accentColor: settings.branding?.accentColor || '#f59e0b',
        siteName: settings.branding?.siteName || 'PikeyTravels',
        logoUrl: settings.branding?.logoUrl || '',
        primaryFont: settings.branding?.primaryFont || 'Inter, sans-serif',
        secondaryFont: settings.branding?.secondaryFont || 'Playfair Display, serif'
      });
      setHeroData({
        headline: settings.hero?.headline || '',
        subheadline: settings.hero?.subheadline || '',
        ctaLabel: settings.hero?.ctaLabel || 'Find Packages',
        ctaLink: settings.hero?.ctaLink || '/packages',
        backgroundImageUrl: settings.hero?.backgroundImageUrl || ''
      });
      setFooterData({
        aboutText: settings.footer?.aboutText || '',
        address: settings.footer?.address || '',
        phone: settings.footer?.phone || '',
        email: settings.footer?.email || '',
        whatsapp: settings.footer?.whatsapp || '',
        instagram: settings.footer?.socialLinks?.instagram || '',
        facebook: settings.footer?.socialLinks?.facebook || '',
        youtube: settings.footer?.socialLinks?.youtube || '',
        copyrightText: settings.footer?.copyrightText || ''
      });
      setAdminEmailsString((settings.adminEmails || []).join(', '));
      // Normalize sections: support boolean or nested { isVisible }
      const readSection = (val) => {
        if (val === undefined) return true;
        if (typeof val === 'boolean') return val;
        if (val && typeof val === 'object') return val.isVisible !== false;
        return true;
      };

      setSectionsData({
        packagesSlider: readSection(settings.sections?.packagesSlider),
        hotelsSection: readSection(settings.sections?.hotelsSection),
        cabsSection: readSection(settings.sections?.cabsSection),
        guidesSection: readSection(settings.sections?.guidesSection),
        reviewsSection: readSection(settings.sections?.reviewsSection)
      });
      setSiteInfoData({
        heading: settings.siteInfo?.heading || '',
        description: settings.siteInfo?.description || '',
        stats: settings.siteInfo?.stats || [
          { label: 'Happy Travelers', value: '500+' },
          { label: 'Destinations', value: '50+' },
          { label: 'Expert Guides', value: '100+' },
          { label: '5-Star Reviews', value: '4.8' }
        ],
        features: settings.siteInfo?.features || [
          'Expert Local Guides',
          'Customized Itineraries',
          '24/7 Customer Support',
          'Best Price Guarantee'
        ],
        isVisible: settings.siteInfo?.isVisible !== false
      });
      setGuestOptionsString((settings.guestOptions || []).join(',') || '1,2,3,4');
    }
  }, [settings]);

  const brandingMutation = useMutation({
    mutationFn: () => updateBranding(formData),
    onSuccess: () => {
      toast.success('Branding saved');
      queryClient.invalidateQueries(['siteSettings']);
    },
    onError: () => toast.error('Failed to save')
  });

  const heroMutation = useMutation({
    mutationFn: () => updateHero(heroData),
    onSuccess: () => {
      toast.success('Hero saved');
      queryClient.invalidateQueries(['siteSettings']);
    },
    onError: () => toast.error('Failed to save')
  });

  const footerMutation = useMutation({
    mutationFn: () => updateFooter(footerData),
    onSuccess: () => {
      toast.success('Footer saved');
      queryClient.invalidateQueries(['siteSettings']);
    },
    onError: () => toast.error('Failed to save')
  });

  const adminEmailsMutation = useMutation({
    mutationFn: async () => {
      const arr = adminEmailsString.split(',').map(s => s.trim()).filter(Boolean);
      // validate emails
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalid = arr.find(e => !emailRx.test(e));
      if (invalid) {
        throw new Error(`Invalid email: ${invalid}`);
      }
      return updateSiteSettings({ adminEmails: arr });
    },
    onSuccess: () => {
      toast.success('Admin emails saved');
      queryClient.invalidateQueries(['siteSettings']);
    },
    onError: (err) => toast.error(err?.message || 'Failed to save admin emails')
  });

  const sectionsMutation = useMutation({
    mutationFn: () => updateSections(sectionsData),
    onSuccess: () => {
      toast.success('Section visibility saved');
      queryClient.invalidateQueries(['siteSettings']);
    },
    onError: () => toast.error('Failed to save')
  });

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'hero', label: 'Hero Section', icon: Image },
    { id: 'siteInfo', label: 'Site Info', icon: Type },
    { id: 'sections', label: 'Sections', icon: Layout },
    { id: 'footer', label: 'Footer', icon: Globe }
  ];

  const fonts = [
    'Inter, sans-serif',
    'Poppins, sans-serif',
    'Open Sans, sans-serif',
    'Roboto, sans-serif',
    'Lato, sans-serif',
    'Montserrat, sans-serif',
    'Playfair Display, serif',
    'Merriweather, serif',
    'Lora, serif'
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
              <p className="text-gray-500 text-sm mt-1">Configure your website appearance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <div className="w-48 shrink-0">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${
                    activeTab === tab.id ? 'bg-primary-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-sm border p-6">
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Colors & Fonts</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Color</label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Accent Color</label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Site Name (displayed in navbar)</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="PikeyTravels"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Logo URL (optional - replaces site name if provided)</label>
                  <input
                    type="text"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://..."
                  />
                  {formData.logoUrl && (
                    <img src={formData.logoUrl} alt="Logo preview" className="mt-2 h-10 object-contain" onError={(e) => e.target.style.display = 'none'} />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Font</label>
                  <select
                    value={formData.primaryFont}
                    onChange={(e) => setFormData({ ...formData, primaryFont: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {fonts.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Font (Headings)</label>
                  <select
                    value={formData.secondaryFont}
                    onChange={(e) => setFormData({ ...formData, secondaryFont: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {fonts.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => brandingMutation.mutate()}
                  disabled={brandingMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  <Save size={18} />
                  {brandingMutation.isPending ? 'Saving...' : 'Save Branding'}
                </button>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Hero Section</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Background Image URL</label>
                  <input
                    value={heroData.backgroundImageUrl}
                    onChange={(e) => setHeroData({ ...heroData, backgroundImageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Headline</label>
                  <input
                    value={heroData.headline}
                    onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Discover Your Perfect Trip"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subheadline</label>
                  <input
                    value={heroData.subheadline}
                    onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Book hotels, cabs, and guides"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                    <input
                      value={heroData.ctaLabel}
                      onChange={(e) => setHeroData({ ...heroData, ctaLabel: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Link</label>
                    <input
                      value={heroData.ctaLink}
                      onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <button
                  onClick={() => heroMutation.mutate()}
                  disabled={heroMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  <Save size={18} />
                  {heroMutation.isPending ? 'Saving...' : 'Save Hero'}
                </button>
              </div>
            )}

            {activeTab === 'siteInfo' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Homepage Site Info</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Heading</label>
                  <input value={siteInfoData.heading} onChange={(e) => setSiteInfoData({ ...siteInfoData, heading: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea value={siteInfoData.description} onChange={(e) => setSiteInfoData({ ...siteInfoData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stats (label / value)</label>
                  {siteInfoData.stats.map((s, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input className="flex-1 px-3 py-2 border rounded" value={s.label} onChange={(e) => {
                        const stats = [...siteInfoData.stats]; stats[idx].label = e.target.value; setSiteInfoData({ ...siteInfoData, stats });
                      }} />
                      <input className="w-36 px-3 py-2 border rounded" value={s.value} onChange={(e) => {
                        const stats = [...siteInfoData.stats]; stats[idx].value = e.target.value; setSiteInfoData({ ...siteInfoData, stats });
                      }} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                  <textarea rows={4} value={siteInfoData.features.join('\n')} onChange={(e) => setSiteInfoData({ ...siteInfoData, features: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 border rounded" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Guest selection options (comma separated numbers)</label>
                  <input value={guestOptionsString} onChange={(e) => setGuestOptionsString(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="1,2,3,4" />
                  <p className="text-sm text-gray-500 mt-1">These values will be used as the guest dropdown on package pages if present.</p>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={siteInfoData.isVisible} onChange={(e) => setSiteInfoData({ ...siteInfoData, isVisible: e.target.checked })} />
                    <span className="text-sm">Show this section on homepage</span>
                  </label>
                </div>

                <button onClick={() => {
                  // send siteInfo + guestOptions to the update endpoint
                  const payload = { siteInfo: { ...siteInfoData } };
                  const parsed = guestOptionsString.split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n) && n > 0);
                  if (parsed.length > 0) payload.guestOptions = parsed;
                  updateSiteSettings(payload).then(() => {
                    toast.success('Site info saved');
                    queryClient.invalidateQueries(['siteSettings']);
                  }).catch(() => toast.error('Failed to save site info'));
                }} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg">
                  <Save size={18} /> Save Site Info
                </button>
              </div>
            )}

            {activeTab === 'sections' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Homepage Sections</h2>
                <p className="text-gray-500 text-sm">Toggle visibility of sections on the homepage</p>

                <div className="space-y-3">
                  {[
                    { key: 'packagesSlider', label: 'Top Rated Packages Slider' },
                    { key: 'hotelsSection', label: 'Hotels Section' },
                    { key: 'cabsSection', label: 'Cabs Section' },
                    { key: 'guidesSection', label: 'Guides Section' },
                    { key: 'reviewsSection', label: 'Customer Reviews Section' }
                  ].map(item => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <span>{item.label}</span>
                      <input
                        type="checkbox"
                        checked={sectionsData[item.key]}
                        onChange={(e) => setSectionsData({ ...sectionsData, [item.key]: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => sectionsMutation.mutate()}
                  disabled={sectionsMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  <Save size={18} />
                  {sectionsMutation.isPending ? 'Saving...' : 'Save Visibility'}
                </button>
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Footer Settings</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">About Text</label>
                  <textarea
                    value={footerData.aboutText}
                    onChange={(e) => setFooterData({ ...footerData, aboutText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input
                      value={footerData.address}
                      onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      value={footerData.phone}
                      onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      value={footerData.email}
                      onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp</label>
                    <input
                      value={footerData.whatsapp}
                      onChange={(e) => setFooterData({ ...footerData, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram</label>
                    <input
                      value={footerData.instagram}
                      onChange={(e) => setFooterData({ ...footerData, instagram: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Facebook</label>
                    <input
                      value={footerData.facebook}
                      onChange={(e) => setFooterData({ ...footerData, facebook: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Copyright Text</label>
                  <input
                    value={footerData.copyrightText}
                    onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="© 2026 PikeyTravels. All rights reserved."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Admin notification emails (comma separated)</label>
                  <textarea
                    value={adminEmailsString}
                    onChange={(e) => setAdminEmailsString(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    placeholder="admin@example.com, ops@example.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">These emails will receive notifications for new provider registrations and bookings.</p>
                </div>

                <button
                  onClick={() => footerMutation.mutate()}
                  disabled={footerMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  <Save size={18} />
                  {footerMutation.isPending ? 'Saving...' : 'Save Footer'}
                </button>

                <button
                  onClick={() => adminEmailsMutation.mutate()}
                  disabled={adminEmailsMutation.isPending}
                  className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg"
                >
                  {adminEmailsMutation.isPending ? 'Saving...' : 'Save Admin Emails'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteSettingsPage;