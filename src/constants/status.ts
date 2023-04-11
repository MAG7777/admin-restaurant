export enum StatusesEnum {
  PUBLISHED = 'published',
  // TO_BE_PUBLISHED = 'toBePublished',
  DRAFT = 'draft',
  ON_MODERATION = 'onModeration',
  DECLINED = 'declined',
  NOT_PUBLISHED = 'notPublished',
}

export type Statuses = `${StatusesEnum}`;

export const statusesNamesHash = {
  [StatusesEnum.PUBLISHED]: 'Опубликовано',
  // [StatusesEnum.TO_BE_PUBLISHED]: 'Запланировано',
  [StatusesEnum.DRAFT]: 'Черновик',
  [StatusesEnum.ON_MODERATION]: 'На модерации',
  [StatusesEnum.DECLINED]: 'Отклонено',
  [StatusesEnum.NOT_PUBLISHED]: 'Снято с публикации',
};

export const statusesColorsHash = {
  [StatusesEnum.PUBLISHED]: 'green',
  // [StatusesEnum.TO_BE_PUBLISHED]: 'gold',
  [StatusesEnum.DRAFT]: '',
  [StatusesEnum.ON_MODERATION]: 'blue',
  [StatusesEnum.DECLINED]: 'red',
  [StatusesEnum.NOT_PUBLISHED]: 'red',
};
