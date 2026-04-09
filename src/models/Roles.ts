import { Modifier, PaginationMetaData } from './Pagination';

export interface CreateRoleDto {
  name: string;
  businesses: Record<string, RoleData>
}

export interface RoleData extends BusinessPermisions {
  visible: boolean
}

export interface BusinessPermisions {
  business: { view: boolean, edit: boolean },
  operations: { view: boolean, edit: boolean },
  accountancy: { view: boolean, edit: boolean },
  users_and_roles: { view: boolean, edit: boolean },
  maintainers: { view: boolean, edit: boolean },
  visible?: boolean
}

export interface GetRoleEntity {
  id: number;
  name: string;
  admin: boolean;
  data: Record<string, BusinessPermisions>;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
  modifier: Modifier
}

export interface CreateInvitationDto {
  email: string;
  roleId: number;
}

export interface GetRoleDataWithPagination {
  data: GetRoleEntity[];
  meta: PaginationMetaData;
}

export interface UpdateRoleDto {
  roleId: number;
  name: string;
  data: Record<string, BusinessPermisions>;
}
