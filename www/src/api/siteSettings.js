import axios from './axios';

export const getSiteSettings = () => axios.get('/api/site-settings');
export const updateSiteSettings = (data) => axios.put('/api/site-settings', data);
export const updateBranding = (data) => axios.put('/api/site-settings/branding', data);
export const updateHero = (data) => axios.put('/api/site-settings/hero', data);
export const updateSections = (data) => axios.put('/api/site-settings/sections', data);
export const updateFooter = (data) => axios.put('/api/site-settings/footer', data);
export const updateNavItems = (data) => axios.put('/api/site-settings/nav-items', data);
