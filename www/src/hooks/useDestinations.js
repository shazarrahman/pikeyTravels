import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../api/destinations';

export const useDestinations = () => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: () => getDestinations().then(res => res.data.data),
  });
};

export const useCreateDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDestination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });
};

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDestination(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDestination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });
};
