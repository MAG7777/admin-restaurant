import { Roles } from 'constants/roles';
import { StatusesEnum } from 'constants/status';

import { JWTService } from './jwt';
const { role } = JWTService.decode(JWTService.getAccessToken());

export const canBePublished = entity => {
  if (role !== Roles.Admin) {
    return false;
  }

  if (
    entity.status !== StatusesEnum.PUBLISHED &&
    entity.status !== StatusesEnum.DRAFT
  ) {
    return true;
  }
};

export const canBeUnPublished = entity => {
  if (role !== Roles.Admin) {
    return false;
  }

  if (entity.status === StatusesEnum.PUBLISHED) {
    return true;
  }
};
