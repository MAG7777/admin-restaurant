// Order from upper to lower levels
export const addressLevels = [
  'region',
  'area',
  'city',
  'settlement',
  'street',
  'house',
];

function getAddressLevels(func) {
  return level => {
    const index = addressLevels.indexOf(level);

    if (index === -1) {
      throw new Error(`Level "${level}" does not exist`);
    }

    return func(addressLevels, index);
  };
}

export const getUpperAddressLevels = getAddressLevels((levels, index) =>
  levels.slice(0, index)
);

export const getLowerAddressLevels = getAddressLevels((levels, index) =>
  levels.slice(index + 1)
);

const fieldType = {
  обл: 'обл.',
  г: 'г.',
  п: 'п.',
  с: 'с.',
  рп: 'р. п.',
  ул: 'ул.',
  пер: 'пер.',
  д: 'д.',
  стр: 'стр.',
  мкр: 'мкр-н',
  'пр-кт': 'пр-т',
  'р-н': 'p-н',
  х: 'х.',
  снт: 'снт',
  ш: 'ш.',
};

const getFieldName = name => {
  const dotIndex = name.indexOf('.');
  if (dotIndex !== -1 && /[.][а-яёА-ЯЁ]+/.test(name)) {
    return `${name.slice(0, dotIndex + 1)} ${name.slice(dotIndex + 1)}`;
  }
  return name;
};

export const makeAddressString = (
  address: any,
  {
    levels = undefined,
    withComment = false,
    exclude = ['region'],
  }: {
    levels?: string[];
    withComment?: boolean;
    exclude?: [] | string[];
  } = {}
) => {
  if (!address) {
    return '';
  }
  // eslint-disable-next-line no-param-reassign
  levels = levels || addressLevels;
  if (exclude.length) {
    const oldLevels = new Set(levels);
    exclude.forEach(item => {
      oldLevels.delete(item);
    });
    levels = Array.from(oldLevels);
  }

  const addressParts = [];
  let cityIsRegion = false;

  if (
    levels.includes('region') &&
    levels.includes('city') &&
    address &&
    address.region &&
    address.city &&
    address.region.fiasId &&
    address.city.fiasId &&
    address.region.fiasId === address.city.fiasId
  ) {
    cityIsRegion = true;
  }

  levels.forEach(type => {
    const field = address[type];

    if (field) {
      const addressPart = field.type
        ? field.isPostfix
          ? `${getFieldName(field.name)} ${fieldType[field.type] || ''}`
          : `${fieldType[field.type] || ''} ${getFieldName(field.name)}`
        : field.name;

      if (!cityIsRegion || type !== 'region') {
        addressParts.push(addressPart);
      }
    }
  });

  if (withComment) {
    addressParts.push(address.comment);
  }

  return addressParts.filter(item => Boolean(item)).join(', ');
};

export const isAddressLevelManual = (address, level, sublevel) =>
  (address[sublevel] && !address[sublevel].fiasId) ||
  (address[level] && !address[level].fiasId);

export const getEipskOrganizationAddress = ({ address }) => {
  let street = '';

  if (address) {
    street = makeAddressString(address);
  }

  return street;
};
