import * as Yup from 'yup';

import {
  contactsSchema,
  contentSchema,
  imageSchema,
  locationSchema,
  scheduleItemSchema,
} from 'utils/yup';
import {
  mapAddress,
  mapContent,
  mapGallery,
  mapImage,
  mapSelect,
  mapValuesToAddress,
  mapValuesToSelect,
} from 'utils/mappings';
import { prepareContent } from 'components/form/Content/utils';
import { Statuses, StatusesEnum } from 'constants/status';
import { IResortDraftItem, IResortItem } from 'store/slices/resorts/interfaces';

export const mapValuesToForm = values => {
  return {
    ...values,
    name: values.name || '',
    shortDescription: values.shortDescription || '',
    address: values.address ? mapValuesToAddress(values.address) : {},
    tags: values.tagsData ? mapValuesToSelect(values.tagsData) : [],
    category: values.categoryData
      ? mapValuesToSelect(values.categoryData)
      : null,
    content: prepareContent(values.content || []),
    status:
      values.status === StatusesEnum.DRAFT
        ? StatusesEnum.PUBLISHED
        : values.status,
    externalUrl: values.externalUrl || '',
  };
};

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Введите от 1 до 255 символов')
    .max(255, 'Введите от 1 до 255 символов')
    .required(),
  shortDescription: Yup.string()
    .trim()
    .min(1, 'Введите от 1 до 255 символов')
    .max(255, 'Введите от 1 до 255 символов')
    .required(),
  image: imageSchema,
  category: Yup.mixed().required(),
  tags: Yup.array().max(10, 'Выберите не более ${max} тегов'),
  content: contentSchema,
  gallery: Yup.array().of(imageSchema),
  address: locationSchema,
  workTime: Yup.object().shape({
    mon: scheduleItemSchema,
    tue: scheduleItemSchema,
    wed: scheduleItemSchema,
    thu: scheduleItemSchema,
    fri: scheduleItemSchema,
    sat: scheduleItemSchema,
    sun: scheduleItemSchema,
    comment: Yup.string().max(255, 'Введите от 1 до 255 символов'),
  }),
  status: Yup.mixed().required(),
  contacts: contactsSchema,
  externalUrl: Yup.string().url(),
});

export const mapValues = (values): IResortItem => {
  return {
    name: values.name.trim(),
    image: mapImage(values.image),
    category: mapSelect(values.category) as number,
    tags: mapSelect(values.tags) as number[],
    shortDescription: values.shortDescription.trim(),
    content: mapContent(values.content),
    gallery: mapGallery(values.gallery),
    address: mapAddress(values.address),
    workTime: values.workTime,
    contacts: values.contacts,
    status: mapSelect(values.status) as Statuses,
    externalUrl: values.externalUrl || null,
  };
};

export const mapValuesToDraft = (values): IResortDraftItem => {
  return {
    name: values.name?.trim() || null,
    image: values.image ? mapImage(values.image) : null,
    category: values.category ? (mapSelect(values.category) as number) : null,
    tags: values.tags?.length ? (mapSelect(values.tags) as number[]) : [],
    shortDescription: values.shortDescription?.trim() || null,
    content: values.content?.length ? mapContent(values.content) : [],
    gallery: values.gallery?.length ? mapGallery(values.gallery) : [],
    address:
      values.address?.city || values.address?.settlement
        ? mapAddress(values.address)
        : null,
    workTime: values.workTime,
    contacts: values.contacts?.length > 0 ? values.contacts : [],
    externalUrl: values.externalUrl || null,
  };
};
