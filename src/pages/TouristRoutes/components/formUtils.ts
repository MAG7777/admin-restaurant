import * as Yup from 'yup';
import { nanoid } from 'nanoid';

import {
  audioSchema,
  contentSchema,
  imageSchema,
  routePointsSchema,
} from 'utils/yup';
import {
  mapAddress,
  mapContent,
  mapImage,
  mapSelect,
  mapValuesToAddress,
  mapValuesToSelect,
} from 'utils/mappings';
import { prepareContent } from 'components/form/Content/utils';
import {
  ITouristRoutesDraftItem,
  ITouristRoutesItem,
} from 'store/slices/touristRoutes/interfaces';
import { Statuses, StatusesEnum } from 'constants/status';

export const mapValuesToForm = values => {
  return {
    ...values,
    tags: values.tagsData ? mapValuesToSelect(values.tagsData) : [],
    routeType: values.routeTypeData
      ? mapValuesToSelect(values.routeTypeData)
      : null,
    routeLevel: values.routeLevelData
      ? mapValuesToSelect(values.routeLevelData)
      : null,
    content: prepareContent(values.content || []),
    points: mapValuesToPoints(values.points),
    polyline: values.polylines,
    status: values.status === StatusesEnum.DRAFT ? null : values.status,
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
    .min(1, 'Введите от 1 до 150 символов')
    .max(150, 'Введите от 1 до 150 символов')
    .required(),
  image: imageSchema,
  tags: Yup.array().max(10, 'Выберите не более ${max} тегов'),
  routeType: Yup.mixed().required(),
  routeLevel: Yup.mixed(),
  audio: audioSchema.nullable(),
  points: routePointsSchema,
  content: contentSchema,
  status: Yup.mixed().required(),
  days: Yup.number().required(),
  duration: Yup.string().required(),
  externalUrl: Yup.string().url(),
});

export const mapValues = (values): ITouristRoutesItem => {
  return {
    name: values.name.trim(),
    image: mapImage(values.image),
    tags: mapSelect(values.tags) as number[],
    shortDescription: values.shortDescription.trim(),
    routeType: values.routeType ? Number(mapSelect(values.routeType)) : null,
    routeLevel: values.routeLevel ? Number(mapSelect(values.routeLevel)) : null,
    content: mapContent(values.content),
    points: mapPoints(values.points),
    polylines:
      values.polyline &&
      values.polyline.map(item => {
        return [String(item[0]), String(item[1])];
      }),
    status: mapSelect(values.status) as Statuses,
    audio: values.audio?.path ? values.audio : null,
    days: values.days || values.days === 0 ? Number(values.days) : null,
    duration: values.duration || null,
    externalUrl: values.externalUrl || null,
  };
};

export const mapValuesToDraft = (values): ITouristRoutesDraftItem => {
  return {
    name: values.name?.trim() || null,
    image: values.image ? mapImage(values.image) : null,
    tags: values.tags?.length ? (mapSelect(values.tags) as number[]) : [],
    shortDescription: values.shortDescription?.trim() || null,
    routeType: values.routeType ? Number(mapSelect(values.routeType)) : null,
    routeLevel: values.routeLevel ? Number(mapSelect(values.routeLevel)) : null,
    content: values.content?.length ? mapContent(values.content) : [],
    points: values.points?.length ? mapPoints(values.points) : [],
    polylines:
      (values.polyline &&
        values.polyline.map(item => {
          return [String(item[0]), String(item[1])];
        })) ||
      null,
    audio: values.audio?.path ? values.audio : null,
    days: values.days ? Number(values.days) : null,
    duration: values.duration || null,
    externalUrl: values.externalUrl || null,
  };
};

const mapPoints = points => {
  return points.map(item => {
    if (item.type === 'manual') {
      return {
        type: 'geoPosition',
        geoPosition: {
          name: item.routeName,
          shortDescription: item.shortDescription,
          description: mapContent(item.description),
          address: mapAddress(item.address),
          image: mapImage(item.image),
          duration: item.duration,
          audio: item.audio?.path ? item.audio : null,
        },
      };
    }
    if (item.type === 'place') {
      return {
        type: 'widget',
        widget: {
          type: mapSelect(item.placeType),
          id: mapSelect(item.place),
          duration: item.duration,
          description: mapContent(item.description),
          audio: item.audio?.path ? item.audio : null,
        },
      };
    }
  });
};

const mapValuesToPoints = points => {
  return points.map(item => {
    if (item.type === 'geoPosition') {
      const value = item.geoPosition;
      return {
        id: nanoid(),
        type: 'manual',
        routeName: value.name,
        shortDescription: value.shortDescription,
        description: prepareContent(value.description || []),
        address: value.address ? mapValuesToAddress(value.address) : {},
        image: value.image,
        duration: value.duration,
        audio: value.audio,
      };
    }
    if (item.type === 'widget') {
      const value = item.widget;
      return {
        id: nanoid(),
        type: 'place',
        placeType: item.widget.type,
        place: mapValuesToSelect(value.widgetData),
        duration: value.duration,
        description: prepareContent(value.description || []),
        audio: value.audio,
      };
    }
  });
};
