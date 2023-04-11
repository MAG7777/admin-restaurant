import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';

import { ICatalogItem, IEditRequestValues } from './interfaces';

type TListResponse = { data: ICatalogItem[]; total: number };
export const loadCatalogList = createAsyncThunk<
  TListResponse,
  {
    limit?: number;
    offset?: number;
    name?: string;
    entityType?: string;
    type?: string;
    sort?: string;
  },
  { state: RootState }
>('catalog/loadList', async (params, { getState }) => {
  const { limit } = getState().catalog;
  const { data } = await apiClient.get<TListResponse>(urls.api.catalog.get, {
    params: {
      limit,
      ...params,
    },
  });
  return data;
});

export const loadCatalogItem = createAsyncThunk<ICatalogItem, string>(
  'catalog/loadItem',
  async id => {
    const { data } = await apiClient.get<ICatalogItem>(
      getUrlWithParams(urls.api.catalog.getOne, {
        id,
      })
    );
    return data;
  }
);

export const saveCatalogItem = createAsyncThunk<
  ICatalogItem,
  IEditRequestValues | ICatalogItem
>('catalog/saveItem', async params => {
  const { id, ...requestParams } = params;
  if (id) {
    const { data } = await apiClient.patch<ICatalogItem>(
      getUrlWithParams(urls.api.catalog.patch, { id }),
      {
        ...requestParams,
      }
    );
    return data;
  } else {
    const { data } = await apiClient.post<ICatalogItem>(urls.api.catalog.post, {
      ...requestParams,
    });
    return data;
  }
});

export const removeCatalogItem = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  number
>('catalog/removeItem', async id => {
  const { data } = await apiClient.delete<{
    accessToken: string;
    refreshToken: string;
  }>(getUrlWithParams(urls.api.catalog.delete, { id }));
  return data;
});
