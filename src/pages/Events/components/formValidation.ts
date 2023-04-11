import * as Yup from 'yup';
import deepEqual from 'fast-deep-equal/react';

import {
  contentSchema,
  imageSchema,
  locationSchema,
  scheduleItemSchema,
} from 'utils/yup';
import {
  DateTableType,
  PlaceType,
} from 'components/form/Places/components/PlaceItemContent';
import { isNumber } from 'utils/helpers';
import { defaultScheduleDump } from 'components/form/Places/components/formUtils';

export const placeWidgetSchema = Yup.object().shape({
  place: Yup.mixed().required(),
  placeType: Yup.mixed().required(),
});

export const placeAddressSchema = Yup.object().shape({
  address: locationSchema,
});

export const placeSessionsSchema = Yup.object().shape({
  sessions: Yup.array()
    .min(1, 'Добавьте хотя бы один сеанс')
    .of(
      Yup.object().shape({
        date: Yup.mixed().required(),
        from: Yup.number()
          .nullable()
          .test({
            test: function (from) {
              if (this.parent.fullDay) return true;
              return !!from;
            },
            message: 'Должно быть указано время начала',
          }),
        to: Yup.number()
          .nullable()
          .test({
            test: function (to) {
              if (this.parent.fullDay) return true;
              return !!to;
            },
            message: 'Должно быть указано время окончания работы',
          })
          .test({
            test: function (to) {
              if (this.parent.from !== null && to !== null) {
                return this.parent.from < to;
              } else {
                return true;
              }
            },
            message: 'Введите дату позднее даты начала',
          }),
        fullDay: Yup.mixed(),
      })
    ),
});

export const placeScheduleSchema = Yup.object().shape({
  schedule: Yup.object().shape({
    date: Yup.mixed().required('Введите даты проведения'),
    table: Yup.object()
      .shape({
        mon: scheduleItemSchema,
        tue: scheduleItemSchema,
        wed: scheduleItemSchema,
        thu: scheduleItemSchema,
        fri: scheduleItemSchema,
        sat: scheduleItemSchema,
        sun: scheduleItemSchema,
      })
      .test({
        test: function (table) {
          const defaultTable = JSON.parse(
            JSON.stringify(defaultScheduleDump.table)
          );
          return !deepEqual(table, defaultTable);
        },
        message: 'Укажите время проведения',
      }),
  }),
});

export const placesSchema = Yup.array().of(
  Yup.lazy(value => {
    if (value.type === PlaceType.place) {
      if (value.workTimeType === DateTableType.specific) {
        return placeWidgetSchema.concat(placeSessionsSchema);
      } else {
        return placeWidgetSchema.concat(placeScheduleSchema);
      }
    }
    if (value.type === PlaceType.address) {
      if (value.workTimeType === DateTableType.specific) {
        return placeAddressSchema.concat(placeSessionsSchema);
      } else {
        return placeAddressSchema.concat(placeScheduleSchema);
      }
    }
    return Yup.mixed().notRequired();
  }) as any
);

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Введите от 1 до 255 символов')
    .max(255, 'Введите от 1 до 255 символов')
    .required(),
  image: imageSchema,
  category: Yup.mixed().required(),
  tags: Yup.array().max(10, 'Выберите не более ${max} тегов'),
  region: Yup.mixed().required(),
  shortDescription: Yup.string()
    .trim()
    .min(1, 'Введите от 1 до 150 символов')
    .max(150, 'Введите от 1 до 150 символов')
    .required(),
  gallery: Yup.array().of(imageSchema),
  content: contentSchema,
  ageRestriction: Yup.mixed(),
  places: placesSchema,
  price: Yup.object().shape({
    price: Yup.mixed().test({
      test: function (price) {
        return isNumber(price) ? price >= 1 : true;
      },
      message: 'Введите сумму отличную от 0',
    }),
    maxPrice: Yup.mixed().test({
      test: function (maxPrice) {
        return isNumber(maxPrice)
          ? maxPrice >= 1 && maxPrice >= this.parent.price
          : true;
      },
      message: 'Введите максимальную цену превышающую минимальную',
    }),
    freePrice: Yup.mixed(),
  }),
  externalUrl: Yup.string().url(),
  duration: Yup.mixed(),
  status: Yup.mixed().required(),
});
