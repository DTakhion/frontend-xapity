export interface Pagination {
  page: number;
  take: number;
  skip: number;
  search?: string;
  order?: Order;
  role?: string
}

/* eslint-disable */
export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type Modifier = {
  id: number,
  firstname: string,
  lastname: string,
  rut: string,
  email: string,
  uid: string,
  currentOrganizationId: number,
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}

export type PaginationMetaData = {
  take: number;
  page: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IPagination<T> {
  data: T[];
  meta: PaginationMetaData
}
