import { IAccountState } from 'store/slices/account/interfaces';
import { Role, Roles } from 'constants/roles';

const ACCESS_TOKEN_REF = 'access_token';
const REFRESH_TOKEN_REF = 'refresh_token';

type JWTPayload = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isEmailConfirmed: boolean;
  role: Role;
  iat: number;
  exp: number;
};

export class JWTService {
  public static decode = (token: string): Partial<IAccountState> => {
    if (!token || token === 'undefined') {
      return {
        role: Roles.Unauthorized,
      } as IAccountState;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    console.log(JSON.parse(jsonPayload), 'jsonPayload');
    const {
      id,
      role,
      email,
      firstName,
      lastName,
      isEmailConfirmed,
      iat,
      exp,
    }: JWTPayload = JSON.parse(jsonPayload);
    return {
      id,
      role,
      email,
      firstName,
      lastName,
      isEmailConfirmed,
      jwt: {
        iat,
        exp,
      },
    };
  };

  public static setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_REF, token);
  }

  public static getAccessToken(): string {
    return localStorage.getItem(ACCESS_TOKEN_REF);
  }

  public static setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_REF, token);
  }

  public static getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN_REF);
  }

  public static clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_REF);
    localStorage.removeItem(REFRESH_TOKEN_REF);
  }
}
