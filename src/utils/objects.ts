import { isEmpty } from './helpers';

/**
 * Возвращает значение у свойства объекта c поддержкой массивов. Св-во объекта указывается через ".", напр: 'a.b[1].c'
 */
export const getValueByStringKeyWithArr = (
  object,
  path,
  defaultValue = undefined
) => {
  if (!object || isEmpty(object) || !path) {
    return false;
  }
  return (
    path
      // eslint-disable-next-line no-useless-escape
      .split(/[\.\[\]\'\"]/)
      .filter(p => p)
      .reduce((o, p) => (o ? o[p] : defaultValue), object)
  );
};
