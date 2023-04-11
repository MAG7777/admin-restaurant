import querystring from 'query-string';

import { IAddress } from 'types/address';

import { removeEmptyValues } from './helpers';
import { apiClient } from './http';

interface IGetAddresses {
  limit?: number;
  nameQuery?: string;
  restriction?: {
    _id: string;
    level: string;
  };
  type: string;
}

export const getaddresses = async ({
  limit,
  nameQuery,
  restriction,
  type,
}: IGetAddresses): Promise<IAddress[] | []> => {
  const data = removeEmptyValues({
    count: limit,
    query: nameQuery,
    type,
  });

  if (restriction) {
    data[restriction.level + 'FiasId'] = restriction._id;
  }

  if (!data.query) {
    return [];
  }

  try {
    const response = await apiClient.get<IAddress[]>(
      `/dadata?${querystring.stringify(data)}`
    );

    return response.data.reduce((acc, item) => {
      if (item.house && !item.house.fiasId) {
        return acc;
      } else {
        acc.push(item as never);
      }

      return acc;
    }, []);
  } catch (e: unknown) {
    console.error(e);
    return [];
  }
};
