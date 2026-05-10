import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../api/siteSettings';

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const res = await getSiteSettings();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
