import * as yup from 'yup';

import { isEmpty, omit, reject, stripTagsAndTrim } from './helpers';
import { DefaultContactOptionsTypes } from '../components/form/Contacts/ContactsSelector';
import { checkEnLanguage, enDomainRegex, ruDomainRegex } from './regExp';

const notTypeHash = {
  number: 'Введите число',
};

yup.setLocale({
  mixed: {
    default: 'Значение введено неверно',
    required: 'Это поле необходимо заполнить',
    oneOf: 'Необходимо ввести одно из следующих значений: ${values}',
    notOneOf: 'Возможно ввести любые значения, кроме: ${values}',
    notType: ({ type }) => notTypeHash[type] || `Введите значение типа ${type}`,
  },
  string: {
    length: 'Введите точно ${length} символов',
    min: 'Введите минимум ${min} символов',
    max: 'Введите не более ${max} символов',
    matches: '${path} must match the following: "${regex}"',
    email: 'Введите корректный адрес электронной почты',
    url: 'Введите корректный URL',
  },
  number: {
    min: 'Введите число большее или равное ${min}',
    max: 'Введите число меньше или равное ${max}',
    positive: 'Введите положительное число',
    negative: 'Введите отрицательное число',
    integer: 'Введите целое число',
  },
  array: {},
  date: {
    min: 'Введите дату позднее чем ${min}',
    max: 'Введите дату раньше чем ${max}',
  },
});

export const timestampSchema = yup.date().transform(function (value, original) {
  const date = new Date(original);
  if (this.isType(date)) {
    return date;
  }

  return value;
});

export const passwordSchema = yup
  .string()
  .test('isMatch', 'Пароли должны совпадать', function (value) {
    return value === this.parent.password;
  });

export const phoneSchema = yup
  .string()
  .matches(
    /7\d{10}/,
    'Телефон должен состоять из 11-ти цифр и начинаться с цифры 7.'
  );

export const shortPhoneSchema = yup
  .string()
  .required()
  .matches(/^(\d{10})?$/, 'Телефон должен состоять из 10-ти цифр');

export const addressSchema = yup.object().shape({
  region: yup.mixed().required(),
  area: yup.mixed(),
  city: yup.mixed().test({
    test: function (city) {
      const { settlement } = this.parent;
      return city || settlement;
    },
    message: 'Это поле необходимо заполнить',
  }),
  settlement: yup.mixed(),
  street: yup.mixed(),
  house: yup.mixed(),
  comment: yup.string().max(255),
});

export const mapPositionSchema = yup.mixed().test({
  test: function (mapPosition) {
    if (!this.parent.city) {
      return true;
    } else {
      return mapPosition && mapPosition.length === 2;
    }
  },
  message: 'Необходимо указать точку на карте',
});

export const locationSchema = yup
  .object()
  .shape({
    mapPosition: mapPositionSchema,
  })
  .concat(addressSchema);

export const scheduleItemSchema = yup.object().shape({
  from: yup
    .number()
    .nullable()
    .test({
      test: function (from) {
        return this.parent.to === null || from !== null;
      },
      message: 'Должно быть указано время начала',
    }),
  to: yup
    .number()
    .nullable()
    .test({
      test: function (to) {
        return this.parent.from === null || to !== null;
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
});

export const widgetAddressSchema = yup.object().shape({
  region: yup.mixed().required(),
  area: yup.mixed().test({
    test: function () {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { region, ...value } = this.parent;
      return isEmpty(value);
    },
    message: 'Это поле необходимо заполнить',
  }),
  city: yup.mixed(),
  settlement: yup.mixed(),
  street: yup.mixed(),
  house: yup.mixed(),
});

export const widgetLocationSchema = yup.object().shape({
  locale: yup.mixed(),
  address: widgetAddressSchema.required(),
  mapPosition: mapPositionSchema,
});

export const imageSchema = yup.object().shape({
  source: yup.string().required(),
  description: yup.string().trim(),
  author: yup.string().required(),
  file: yup.mixed(),
  averageColor: yup.string(),
  path: yup.string().trim(),
});

export const contentSchema = yup
  .array()
  .of(
    yup.object().shape({
      type: yup
        .string()
        .oneOf(['text', 'image', 'gallery', 'video', 'widget'])
        .required(),
      text: yup.string().when('type', {
        is: 'text',
        then: yup.string(),
        // .test('text', 'Это поле необходимо заполнить', function () {
        //   // 'from' will contain the ancestor tree. You can access like from[1], from[2].
        //   // проверка на заполненость контента, сделана здесь, чтобы корректно очищались ошибки(react-hook-form) при вводе текста
        //   const { from } = this as any;
        //   if (
        //     from[1].value.content.length === 1 &&
        //     from[1].value.content[0].type === 'text'
        //   ) {
        //     return stripTagsAndTrim(from[1].value.content[0].text);
        //   }
        //   return true;
        // }),
      }),
      image: yup.mixed().when('type', {
        is: 'image',
        then: imageSchema.required(),
      }),
      gallery: yup.array().when('type', {
        is: 'gallery',
        then: yup.array().of(imageSchema).required(),
      }),
      video: yup.mixed().when('type', {
        is: 'video',
        then: yup.string().url().required(),
      }),
      widget: yup.object().when('type', {
        is: 'widget',
        then: yup
          .object()
          .shape({
            type: yup
              .string()
              .oneOf(['article', 'event', 'place', 'manual'])
              .required(),
            article: yup.mixed().when('type', {
              is: 'article',
              then: yup.mixed().required(),
            }),
            event: yup.mixed().when('type', {
              is: 'event',
              then: yup.mixed().required(),
            }),
            manual: yup.mixed().when('type', {
              is: 'manual',
              then: yup
                .object()
                .shape({
                  description: yup.string().trim().max(150).required(),
                  image: imageSchema.required(),
                  location: widgetLocationSchema.required(),
                  name: yup.string().max(256).required(),
                  url: yup.string().url(),
                })
                .required(),
            }),
            place: yup.mixed().when('type', {
              is: 'place',
              then: yup.mixed().required(),
            }),
            entityDescription: yup.string().trim().max(512),
          })
          .required(),
      }),
    })
  )
  .required()
  .test({
    test: function (arr) {
      const preparedContent = reject(
        arr,
        ({ type, text }) => type === 'text' && !stripTagsAndTrim(text)
      ).map(item => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return omit(item, 'originalIndex');
      });

      return Boolean(preparedContent.length);
    },
    message: 'Это поле необходимо заполнить',
  });

export const seoSchema = yup.object().shape({
  title: yup.string().max(256),
  description: yup.string().trim().max(256),
});

export const tagsSchema = yup.mixed().test({
  test: function (value) {
    const { category } = this.parent;
    return !category || value.find(item => item._id === category._id);
  },
  message: 'Теги не могут пересекаться с категорией',
});

export const validateRuDomain = yup
  .string()
  .required()
  .matches(ruDomainRegex, 'Введите корректную ссылку');

export const validateEnDomain = yup
  .string()
  .required()
  .matches(enDomainRegex, 'Введите корректную ссылку');

export const contactsSchema = yup.array().of(
  yup.object().shape({
    type: yup
      .string()
      .oneOf([
        DefaultContactOptionsTypes.Phone,
        DefaultContactOptionsTypes.Email,
        DefaultContactOptionsTypes.Site,
        DefaultContactOptionsTypes.VK,
        DefaultContactOptionsTypes.OK,
        DefaultContactOptionsTypes.Telegram,
        DefaultContactOptionsTypes.YandexDzen,
      ])
      .required(),
    value: yup
      .string()
      .when('type', {
        is: DefaultContactOptionsTypes.Phone,
        then: shortPhoneSchema,
      })
      .when('type', {
        is: DefaultContactOptionsTypes.Email,
        then: yup.string().required().email(),
      })
      .when('type', {
        is: DefaultContactOptionsTypes.Site,
        then: yup.lazy(value =>
          checkEnLanguage(value) ? validateEnDomain : validateRuDomain
        ),
      })
      .when('type', {
        is: DefaultContactOptionsTypes.VK,
        then: validateEnDomain,
      })
      .when('type', {
        is: DefaultContactOptionsTypes.OK,
        then: validateEnDomain,
      })
      .when('type', {
        is: DefaultContactOptionsTypes.Telegram,
        then: validateEnDomain,
      })
      .when('type', {
        is: DefaultContactOptionsTypes.YandexDzen,
        then: validateEnDomain,
      }),
  })
);

export const audioSchema = yup.object().shape({
  realName: yup.string(),
  path: yup.string(),
  baseUrl: yup.string(),
});

const routesPlaceSchema = yup.object().shape({
  placeType: yup.mixed().required(),
  place: yup.mixed().required(),
  duration: yup.string(),
  description: contentSchema.required(),
  audio: audioSchema.nullable(),
});

const routesManualSchema = yup.object().shape({
  routeName: yup.string().required(),
  shortDescription: yup.string().required(),
  description: contentSchema.required(),
  address: locationSchema,
  image: imageSchema,
  duration: yup.string(),
  audio: audioSchema.nullable(),
});

export const routePointsSchema = yup.array().of(
  yup.lazy(value => {
    if (value.type === 'place') {
      return routesPlaceSchema.required();
    }
    if (value.type === 'manual') {
      return routesManualSchema.required();
    }
    return yup.mixed().notRequired();
  }) as any
);

export default yup;
