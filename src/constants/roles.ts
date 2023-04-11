export enum Roles {
  Unauthorized = 'unauthorized',
  Guest = 'adminGuest',
  Admin = 'admin',
  Moderator = 'adminModerator',
  // Cabinet = 'Cabinet',
}

export type Role = `${Roles}`;
