import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from './queryKeys';
import authService from '@/services/authService';

export const useQueryGetInvitationInfo = (token: string) => {
  return (
    useQuery({
      enabled: !!token,
      queryKey: [QueryKeys.GET_INVITATION],
      queryFn: async () => {
        const res = await authService.getInvitationInfo(token);
        if (res.status === 200) {
          return res.data;
        }
        throw new Error('Error fetching businesses');
      }
    })
  );
};
