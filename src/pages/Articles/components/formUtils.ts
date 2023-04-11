import * as Yup from 'yup';
import { FieldValues } from 'react-hook-form';

import {
  mapContent,
  mapImage,
  mapRegion,
  mapSelect,
  mapValuesToRegion,
  mapValuesToSelect,
} from 'utils/mappings';
import { contentSchema, imageSchema } from 'utils/yup';
import { prepareContent } from 'components/form/Content/utils';
import { StatusesEnum } from 'constants/status';

export const mapValuesToForm = values => {
  return {
    ...values,
    name: values.name || '',
    category: values.categoryData
      ? mapValuesToSelect(values.categoryData)
      : null,
    region: values.region ? mapValuesToRegion(values.region) : null,
    tags: values.tagsData ? mapValuesToSelect(values.tagsData) : [],
    content: prepareContent(values.content || []),
    status:
      values.status === StatusesEnum.DRAFT
        ? StatusesEnum.PUBLISHED
        : values.status,
  };
};

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Введите от 1 до 255 символов')
    .max(255, 'Введите от 1 до 255 символов')
    .required('Это поле необходимо заполнить'),
  image: imageSchema,
  shortName: Yup.string()
    .trim()
    .min(1, 'Введите от 1 до 80 символов')
    .max(80, 'Введите от 1 до 80 символов')
    .required(),
  category: Yup.mixed().required(),
  region: Yup.mixed().required(),
  tags: Yup.array().max(10, 'Выберите не более ${max} тегов'),
  content: contentSchema,
  status: Yup.mixed().required(),
});

export const mapValues = (values: FieldValues) => {
  return {
    name: values.name.trim(),
    image: mapImage(values.image),
    shortName: values.shortName.trim(),
    category: mapSelect(values.category),
    tags: mapSelect(values.tags),
    region: mapRegion(values.region),
    content: mapContent(values.content),
    status: mapSelect(values.status),
  };
};

export const mapValuesToDraft = values => {
  return {
    name: values.name?.trim() || '',
    image: values.image ? mapImage(values.image) : null,
    shortName: values.shortName?.trim() || '',
    category: values.category ? mapSelect(values.category) : null,
    tags: values.tags?.length ? mapSelect(values.tags) : [],
    region: values.region ? mapRegion(values.region) : null,
    content: values.content?.length ? mapContent(values.content) : [],
  };
};
