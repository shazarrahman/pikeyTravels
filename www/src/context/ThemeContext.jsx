import { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings } from '../api/siteSettings';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('Fetching site settings...');
        const res = await getSiteSettings();
        console.log('Settings response:', res);
        if (res.data.success) {
          setSettings(res.data.data);
          injectTheme(res.data.data.branding);
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const injectTheme = (branding) => {
    if (!branding) return;
    const root = document.documentElement;
    if (branding.primaryColor) root.style.setProperty('--color-primary', branding.primaryColor);
    if (branding.secondaryColor) root.style.setProperty('--color-secondary', branding.secondaryColor);
    if (branding.accentColor) root.style.setProperty('--color-accent', branding.accentColor);
    if (branding.primaryFont) root.style.setProperty('--font-primary', branding.primaryFont);
    if (branding.secondaryFont) root.style.setProperty('--font-secondary', branding.secondaryFont);
  };

  const refreshSettings = async () => {
    try {
      const res = await getSiteSettings();
      if (res.data.success) {
        setSettings(res.data.data);
        injectTheme(res.data.data.branding);
      }
    } catch (err) {
      console.error('Failed to refresh settings:', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
