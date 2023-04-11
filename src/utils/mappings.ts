import { TImage } from 'types/image';

import {
  flatten,
  isNumber,
  isObject,
  isString,
  omit,
  reject,
  removeEmptyValues,
  stripTagsAndTrim,
} from './helpers';

type Value = string | number;
type SelectValue =
  | Value
  | {
      label: string;
      value: Value;
      extraData?: {
        [key: string]: any;
      };
    };

export const mapSelect = (
  value: SelectValue | SelectValue[]
): Value | Value[] => {
  if (isNumber(value) || isString(value)) {
    return value as Value;
  }
  const mapped = flatten([value]).map(item => item && item.value);

  return Array.isArray(value) ? mapped : mapped[0];
};

export const mapImage = (image: TImage) => {
  return omit(image, ['cropCanvas', 'averageColor', 'size', 'realName']);
};

export const mapGallery = (gallery: TImage[]) => gallery.map(mapImage);

export const mapRegion = region => {
  return { name: region.children, fiasId: region.value };
};

export const mapAddress = address => {
  return {
    ...address,
    region: {
      name: address.region.name,
      fiasId: address.region.fiasId,
    },
  };
};

function mapWidget(widget) {
  const { type } = widget;
  const entity = widget[type];

  return type === 'manual'
    ? removeEmptyValues({
        ...entity,
        ...(entity.image && { image: mapImage(entity.image) }),
        location: mapAddress(entity),
      })
    : entity._id;
}

export const mapContent = content => {
  const contentValue = reject(
    content,
    ({ type, text }) => type === 'text' && !stripTagsAndTrim(text)
  ).map(item => omit(item, 'originalIndex'));

  return contentValue.map(contentItem => {
    switch (contentItem.type) {
      case 'image':
        return {
          ...contentItem,
          image: mapImage(contentItem.image),
        };
      case 'gallery':
        return {
          ...contentItem,
          gallery: mapGallery(contentItem.gallery),
        };
      case 'widget': {
        const widgetType = contentItem.widget.type;

        return {
          type: 'widget',
          widget: {
            type: widgetType,
            [widgetType]: mapWidget(contentItem.widget),
            entityDescription: contentItem.widget.entityDescription,
          },
        };
      }
      default:
        return contentItem;
    }
  });
};

export const mapValuesToSelect = data => {
  if (isObject(data)) {
    return {
      ...data,
      key: data.id,
      value: data.id,
      label: data.name,
    };
  }
  if (Array.isArray(data)) {
    return data.map(item => {
      return {
        ...item,
        key: item.id,
        value: item.id,
        label: item.name,
      };
    });
  }
};

export const mapValuesToAddress = address => {
  return {
    ...address,
    region: {
      ...address.region,
      value: address.region.fiasId,
      children: address.region.name,
      key: address.region.fiasId,
    },
  };
};

export const mapValuesToRegion = region => ({
  value: region.fiasId,
  children: region.name,
  key: region.fiasId,
});

export const mapRegionForFilters = value => {
  if (Array.isArray(value)) {
    if (isString(value[0])) {
      return value;
    }
    if (isObject(value[0])) {
      return value.map(item => item.value);
    }
    return [];
  }
  if (isString(value)) {
    return value;
  }
  if (isObject(value)) {
    return value.value;
  }
  return null;
};

export const mapPrice = value => {
  if (value.price || value.maxPrice) {
    return {
      price: value.price,
      maxPrice: value.maxPrice,
    };
  } else {
    return {
      price: 0,
      maxPrice: 0,
    };
  }
};

export const mapPriceToForm = (price, maxPrice) => {
  const data = {
    price: null,
    maxPrice: null,
    freePrice: false,
  };

  if (!price && !maxPrice) {
    data.freePrice = true;
    return data;
  }

  if (price && maxPrice) {
    data.price = price;
    data.maxPrice = maxPrice;

    return data;
  }

  if (price) {
    data.price = price;
    return data;
  }
};
