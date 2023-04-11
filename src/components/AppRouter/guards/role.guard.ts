import { Role } from 'constants/roles';

const isAllowedRole = (role: Role, allowedRoles: Role[]) => {
  return !!allowedRoles.includes(role);
};

export default isAllowedRole;
