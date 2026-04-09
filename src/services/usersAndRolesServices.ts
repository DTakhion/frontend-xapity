import { AxiosInstance } from 'axios';
import { RestApiService } from './restApiService';
import { CreateInvitationDto, CreateRoleDto, GetRoleDataWithPagination, GetRoleEntity, UpdateRoleDto } from '../models/Roles';
import { Pagination } from '../models/Pagination';
import { GetUsersWithPagination, UpdateUserDto, IUser } from '../models/UsersAndRoles';

class UsersAndRolesService {
  restApiService: AxiosInstance;

  constructor() {
    this.restApiService = RestApiService.getInstance().http;
  }

  public async getRolesWithPagination(
    queryParams: Pick<Pagination, 'page' | 'take' | 'search'>
  ) {
    const { page, take, search } = queryParams;
    return this.restApiService.get<GetRoleDataWithPagination>('/roles', {
      params: { page, take, search: search ? search : undefined },
    });
  }

  public async createRole(createRolePayload: CreateRoleDto) {
    return this.restApiService.post<GetRoleEntity>('/roles', createRolePayload);
  }

  public async invitateUserWithEmail(createInvitationPayload: CreateInvitationDto) {
    return this.restApiService.post<void>('/users/invitations', createInvitationPayload);
  }

  public async updateRole(updateRoleDto: UpdateRoleDto) {
    const roleId = updateRoleDto.roleId;
    return this.restApiService.patch<GetRoleEntity>(`/roles/${roleId}`, updateRoleDto);
  }

  public async getRoleById(roleId?: number) {
    return this.restApiService.get<GetRoleEntity>(`/roles/${roleId}`);
  }

  public async deleteRole(roleId?: number) {
    return this.restApiService.delete<GetRoleEntity>(`/roles/${roleId}`);
  }

  public async getUserById(userId?: number) {
    return this.restApiService.get<IUser>(`/users/${userId}`);
  }

  public async updateUser(updateUserDto: UpdateUserDto) {
    const userId = updateUserDto.userId;
    return this.restApiService.patch<IUser>(`/users/${userId}`, updateUserDto);

  }

  public async deleteUser(userId?: number) {
    return this.restApiService.delete<GetUsersWithPagination>(`/users/${userId}`);
  }
}

export default new UsersAndRolesService();
