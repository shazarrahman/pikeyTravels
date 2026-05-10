import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProviders, 
  createProvider, 
  approveProvider, 
  rejectProvider, 
  toggleProviderShowOnFront, 
  deleteProvider 
} from '../api/providers';

export const useProviders = (params) => {
  return useQuery({
    queryKey: ['providers', params],
    queryFn: () => getProviders(params).then(res => res.data.data),
  });
};

export const useCreateProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'admin'] });
    },
  });
};

export const useApproveProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'admin'] });
    },
  });
};

export const useRejectProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'admin'] });
    },
  });
};

export const useToggleProviderShowOnFront = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleProviderShowOnFront,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'admin'] });
    },
  });
};

export const useDeleteProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'admin'] });
    },
  });
};
