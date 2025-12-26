import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Profile } from './types';

type Response = { profiles: Profile[] };
type Variables = void;

export const useProfiles = createQuery<Response, Variables, AxiosError>({
  queryKey: ['profiles'],
  fetcher: () => {
    return client.get(`app/profile`).then((response) => response.data);
  },
});
