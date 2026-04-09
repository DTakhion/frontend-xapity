import { PaginationMetaData } from './Pagination';

export interface IUserAndRole {
  id: number
  userId: number
  user: IUser
  organizationId: number
  roleId: number
  role: Role,
  active: boolean
  createdAt: Date
  updatedAt: Date
  modifier: IUser
}

export interface Role {
  id: number
  name: string
  admin: boolean
  organizationId: number
  createdAt: Date
  updatedAt: Date
}

export interface IUser {
  id: number
  firstname: string
  lastname: string
  rut: string
  email: string
  uid: string
  currentOrganizationId: number
  userTypes: IUserAndRole[]
  active: boolean
  createdAt: Date
  updatedAt: Date
  modifier: IUser
  roleName: string
  roleId: number
}

export interface GetUsersWithPagination {
  data: IUserAndRole[];
  meta: PaginationMetaData
}

export interface UpdateUserDto {
  userId: number;
  roleId: number;
  firstname: string;
  lastname: string;
  rut: string;
  email: string;
}
