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
    shortDescription: values.shortDescription || '',
    topic: values.topicData ? mapValuesToSelect(values.topicData) : null,
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
    .min(1, 'Введите от 1 до 30 символов')
    .max(30, 'Введите от 1 до 30 символов')
    .required('Это поле необходимо заполнить'),
  image: imageSchema,
  topic: Yup.mixed().required('Выберите тему'),
  region: Yup.mixed().required(),
  tags: Yup.array().max(10, 'Выберите не более ${max} тегов'),
  shortDescription: Yup.string()
    .trim()
    .min(1, 'Введите от 1 до 50 символов')
    .max(50, 'Введите от 1 до 50 символов')
    .required('Это поле необходимо заполнить'),
  content: contentSchema,
  status: Yup.mixed().required(),
  source: Yup.mixed(),
});

export const mapValues = (values: FieldValues) => {
  return {
    name: values.name.trim(),
    image: mapImage(values.image),
    topic: mapSelect(values.topic),
    region: mapRegion(values.region),
    tags: mapSelect(values.tags),
    shortDescription: values.shortDescription.trim(),
    content: mapContent(values.content),
    status: mapSelect(values.status),
    source: values.source || '',
  };
};

export const mapValuesToDraft = values => {
  return {
    name: values.name?.trim() || null,
    image: values.image ? mapImage(values.image) : null,
    topic: values.topic ? mapSelect(values.topic) : null,
    region: values.region ? mapRegion(values.region) : null,
    tags: values.tags?.length ? mapSelect(values.tags) : [],
    shortDescription: values.shortDescription?.trim() || null,
    content: values.content?.length ? mapContent(values.content) : [],
    source: values.source ? values.source : '',
  };
};
