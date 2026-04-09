export interface ICreateOrganizationEntity {
  name: string;
  userType: string;
  siiCredentials: {
    rut: string;
    password: string;
  }
}

export interface IOrganizationEntity {
  id: number;
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
