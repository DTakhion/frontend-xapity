import { AxiosInstance } from 'axios';
import { IAcceptInvitationDto, IGetInvitationInfo, IAuthRegister, ISendInvitationDto } from '../models/Auth';
import { RestApiService } from './restApiService';
import { GetUsersWithPagination } from '../models/UsersAndRoles';
import { Pagination } from '../models/Pagination';

class AuthService {
  restApiService: AxiosInstance;

  constructor() {
    this.restApiService = RestApiService.getInstance().http;
  }

  public async getAll(queryParams: Pick<Pagination, 'page' | 'take' | 'search' | 'role'>) {
    const { page, take, search, role } = queryParams;
    return this.restApiService.get<GetUsersWithPagination>(
      '/users',
      {
        params: {
          page,
          take,
          search: search ? search : undefined,
          role: role ? role : undefined
        }
      });
  }

  public async getInvitationInfo(token: string) {
    return this.restApiService.get<IGetInvitationInfo>('/users/invitations', { params: { token } });
  }

  public async getLoggedInUser() {
    return this.restApiService.get('/users/me');
  }

  public async register(data: IAuthRegister) {
    return this.restApiService.post<{ token: string }>('/auth/register', data);
  }

  public async login(firebaseToken: string) {
    return this.restApiService.post<string>('/auth/login', { token: firebaseToken });
  }

  public async sendInvitation(payload: ISendInvitationDto) {
    return this.restApiService.post<string>('/users/invitations', payload);
  }

  public async acceptInvitation(acceptInvitation: IAcceptInvitationDto) {
    return this.restApiService.post<string>('/auth/invitations', acceptInvitation);
  }
}

export default new AuthService();
