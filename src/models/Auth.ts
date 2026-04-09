// export interface IFormValuesCreateAccount {
//   name: string;
//   lastName: string;
//   rut: string;
//   email: string;
//   password: string;
//   organizationName: string;
//   firebaseToken?: string;
// }

export interface IAuthRegister {
  token: string;
  firstname: string;
  // lastname: string;
  // rut: string;
  email: string;
  organizationName: string;
}

export interface ISendInvitationDto {
  email: string;
  roleId: number;
}

// export interface IFormValuesCreateAccount extends IAuthRegister  {

// }

export interface IAcceptInvitationDto {
  firstname: string;
  // lastname: string;
  // rut: string;
  email: string;
  firebaseToken: string;
  invitationToken: string;
}

export interface IGetInvitationInfo {
  organizationName: string,
  roleName: string,
  email: string
}
