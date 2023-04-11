import React from 'react';

import { urls } from 'store/api';
import { apiClient } from 'utils/http';

import { AsyncSelect, TAsyncSelectProps } from '../base/AsyncSelect';

type IProps = Omit<TAsyncSelectProps, 'fetchOptions' | 'fetchInitialValue'>;

export const AuthorAsyncSelect: React.FC<IProps> = ({ label, ...props }) => {
  const requestUrl = urls.api.users.get;
  const fetchDataFn = async nameQuery => {
    const res = await apiClient.get(requestUrl, {
      params: { name: nameQuery },
    });
    return res.data.data?.map(item => {
      return {
        id: item.id,
        name: `${item.lastName} ${item.firstName}`,
      };
    });
  };

  const fetchInitialValueFn = async ids => {
    const res = await apiClient.get(requestUrl, { params: { ids } });
    const data = res?.data?.data;
    if (!props.mode) {
      return {
        id: data[0].id,
        name: `${data[0].lastName} ${data[0].firstName}`,
      };
    }
    return data.map(item => {
      return {
        id: item.id,
        name: `${item.lastName} ${item.firstName}`,
      };
    });
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
