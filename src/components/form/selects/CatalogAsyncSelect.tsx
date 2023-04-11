import React from 'react';

import { urls } from 'store/api';
import { apiClient } from 'utils/http';

import { AsyncSelect, TAsyncSelectProps } from '../base/AsyncSelect';

interface IProps
  extends Omit<TAsyncSelectProps, 'fetchOptions' | 'fetchInitialValue'> {
  requestParams: {
    entityType?: string;
    fieldType?: string;
  };
  placeholder?: string;
}

export const CatalogAsyncSelect: React.FC<IProps> = ({
  label,
  mode = undefined,
  requestParams,
  ...props
}) => {
  const requestUrl = urls.api.catalog.get;
  const fetchDataFn = async nameQuery => {
    const res = await apiClient.get(requestUrl, {
      params: { name: nameQuery, ...requestParams },
    });
    return res?.data?.data;
  };

  const fetchInitialValueFn = async ids => {
    const res = await apiClient.get(requestUrl, { params: { ids } });
    const data = res?.data?.data;
    if (!mode) {
      return data[0];
    }
    return data;
  };

  return (
    <>
      <AsyncSelect
        label={label}
        allowClear
        {...props}
        mode={mode}
        fetchOptions={fetchDataFn}
        fetchInitialValue={fetchInitialValueFn}
      />
    </>
  );
};
