import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPackages, getFeaturedPackages, getPackageById, createPackage, updatePackage, deletePackage } from '../api/packages';

export const usePackages = (params) => {
  return useQuery({
    queryKey: ['packages', params],
    queryFn: () => getPackages(params).then(res => res.data.data),
  });
};

export const useFeaturedPackages = () => {
  return useQuery({
    queryKey: ['packages', 'featured'],
    queryFn: () => getFeaturedPackages().then(res => res.data.data),
  });
};

export const usePackage = (id) => {
  return useQuery({
    queryKey: ['package', id],
    queryFn: () => getPackageById(id).then(res => res.data.data),
    enabled: !!id,
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
};
