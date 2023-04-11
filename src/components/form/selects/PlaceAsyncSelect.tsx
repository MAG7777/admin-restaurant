import React from 'react';

import { PlaceTypesKeys } from 'constants/places';
import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';

import { AsyncSelect, TAsyncSelectProps } from '../base/AsyncSelect';

type IProps = Omit<TAsyncSelectProps, 'fetchOptions' | 'fetchInitialValue'> & {
  placeType: PlaceTypesKeys;
  requestParams?: {
    [key: string]: unknown;
  };
  showArrow?: boolean;
};

export const PlaceAsyncSelect: React.FC<IProps> = ({
  label,
  placeType,
  requestParams = {},
  ...props
}) => {
  const requestUrl = urls.api[placeType].get;
  const fetchDataFn = async nameQuery => {
    const res = await apiClient.get(requestUrl, {
      params: { name: nameQuery, ...requestParams },
    });
    return res.data.data;
  };

  const fetchInitialValueFn = async ids => {
    let res = null;
    if (props.mode !== 'multiple') {
      res = await apiClient.get(
        getUrlWithParams(urls.api[placeType].getOne, {
          id: ids,
        })
      );
      return res.data;
    } else {
      res = await apiClient.get(requestUrl, {
        params: { ids },
      });
      return res?.data?.data;
    }
  };

  return (
    <>
      <AsyncSelect
        label={label}
        allowClear
        {...props}
        fetchOptions={fetchDataFn}
        fetchInitialValue={fetchInitialValueFn}
      />
    </>
  );
};
