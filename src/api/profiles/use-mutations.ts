import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { CreateProfileVariables, Profile, UpdateProfileVariables } from './types';

export const useAddProfile = createMutation<
  { success: boolean; profile: Profile },
  CreateProfileVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    return client.post('app/profile', variables).then((response) => response.data);
  },
});

export const useUpdateProfile = createMutation<
  { success: boolean; profile: Profile },
  UpdateProfileVariables,
  AxiosError
>({
  mutationFn: async ({ id, ...variables }) => {
    return client.put(`app/profile/${id}`, variables).then((response) => response.data);
  },
});

export const useDeleteProfile = createMutation<
  { success: boolean },
  { id: string },
  AxiosError
>({
  mutationFn: async ({ id }) => {
    return client.delete(`app/profile/${id}`).then((response) => response.data);
  },
});
