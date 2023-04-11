import { PageTitles } from 'constants/pageTitles';

export const breadCrumbsHash = {
  edit: 'Редактирование',
  add: 'Создание',
  ...Object.keys(PageTitles).reduce((acc, key) => {
    acc[key] = PageTitles[key];
    return acc;
  }, {}),
};
