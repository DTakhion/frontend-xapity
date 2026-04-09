import { IAcceptInvitationDto, IAuthRegister, ISendInvitationDto } from '@/models/Auth';
import authService from '@/services/authService';
import { useMutation } from '@tanstack/react-query';

export const useMutationRegisterUser = () => {
  // const setBackendToken = useVlgStore(state => state.setBackendToken);
  return (
    useMutation({
      mutationFn: async (payload: IAuthRegister) => {
        const res = await authService.register(payload);
        if (res.status === 201 || res.status === 200) {
          // setBackendToken(res.data.token);
          return res.data;
        }
        throw new Error('Error creating user');
      },
      onMutate: async () => { },
      onSuccess: async () => { },
    })
  );
};

export const useMutationInvitateUserWithEmail = () => {
  // const queryClient = useQueryClient();
  return (
    useMutation({
      mutationFn: async (payload: ISendInvitationDto) => {
        const res = await authService.sendInvitation(payload);
        if (res.status === 204) {
          return res.data;
        }
        throw new Error('Error creating role');
      },
      onSuccess: async () => {
        // queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_USERS] });
      }
    })
  );
};

export const useMutationAcceptInvitation = () => {
  // const setBackendToken = useVlgStore(state => state.setBackendToken);
  // const setIsAuthenticated = useVlgStore(state => state.setIsAuthenticated);
  return (
    useMutation({
      mutationFn: async (payload: IAcceptInvitationDto) => {
        const res = await authService.acceptInvitation(payload);
        if (res.status === 201 || res.status === 200) {
          // setBackendToken(res.data);
          // setIsAuthenticated(true);
          return res.data;
        }
        throw new Error('Error creating user');
      },
      onMutate: async () => { },
      onSuccess: async () => { }
    })
  );
};

export const useMutationLogin = () => {
  // const setBackendToken = useVlgStore(state => state.setBackendToken);
  // const setIsAuthenticated = useVlgStore(state => state.setIsAuthenticated);
  return (
    useMutation({
      mutationFn: async (firebaseToken: string) => {
        const res = await authService.login(firebaseToken);
        if (res.status === 201 || res.status === 200) {
          // setBackendToken(res.data);
          // setIsAuthenticated(true);
          return res.data;
        }
        throw new Error('Error creating user');
      },
      onMutate: async () => { },
      onSuccess: async () => { },
    })
  );
};
