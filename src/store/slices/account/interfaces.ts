import { Role } from 'constants/roles';

export interface IAccountState {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isEmailConfirmed: boolean;
  jwt: {
    iat: number;
    exp: number;
  };
}
