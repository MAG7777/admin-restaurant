import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';
import { uploadContent, uploadImage, uploadImageArray } from 'utils/upload';

import { IResortItem, IResortItemResponse } from './interfaces';

type TListResponse = { data: IResortItemResponse[]; total: number };

export const loadResortsList = createAsyncThunk<
  TListResponse,
  {
    name?: string;
    limit?: number;
    offset?: number;
    entityType?: string;
    type?: string;
    sort?: string;
  },
  { state: RootState }
>('resorts/loadList', async (params, { getState }) => {
  const { limit } = getState().resorts;
  const { data } = await apiClient.get<TListResponse>(urls.api.resorts.get, {
    params: {
      limit,
      ...params,
    },
  });
  return data;
});

export const loadResortItem = createAsyncThunk<IResortItemResponse, string>(
  'resort/loadItem',
  async id => {
    const { data } = await apiClient.get<IResortItemResponse>(
      getUrlWithParams(urls.api.resorts.getOne, {
        id,
      })
    );
    return data;
  }
);

export const saveResortItem = createAsyncThunk<IResortItem, IResortItem>(
  'resort/saveItem',
  async ({ id, ...params }) => {
    const image = await uploadImage(params.image);
    const gallery = await uploadImageArray(params.gallery);
    const content = await uploadContent(params.content);

    if (id) {
      const { data } = await apiClient.patch<IResortItem>(
        getUrlWithParams(urls.api.resorts.patch, { id }),
        {
          ...params,
          image,
          gallery,
          content,
        }
      );
      return data;
    } else {
      const { data } = await apiClient.post<IResortItem>(
        urls.api.resorts.post,
        {
          ...params,
          image,
          gallery,
          content,
        }
      );
      return data;
    }
  }
);

export const saveResortItemAsDraft = createAsyncThunk<IResortItem, IResortItem>(
  'resort/saveItem',
  async params => {
    const { id, ...requestParams } = params;
    const image = await uploadImage(requestParams.image);
    const gallery = await uploadImageArray(requestParams.gallery);
    const content = await uploadContent(requestParams.content);
    if (id) {
      const { data } = await apiClient.patch<IResortItem>(
        getUrlWithParams(urls.api.resorts.draft.patch, { id }),
        {
          ...requestParams,
          image,
          gallery,
          content,
        }
      );
      return data;
    } else {
      const { data } = await apiClient.post<IResortItem>(
        urls.api.resorts.draft.post,
        {
          ...requestParams,
          image,
          gallery,
          content,
        }
      );
      return data;
    }
  }
);

export const setPublishResort = createAsyncThunk<void, string>(
  'resorts/publish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.resorts.publish.patch, { id })
    );
  }
);

export const setUnPublishResort = createAsyncThunk<void, string>(
  'resorts/unPublish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.resorts.unPublish.patch, { id })
    );
  }
);

// export const removeResortItem = createAsyncThunk<
//   {
//     accessToken: string;
//     refreshToken: string;
//   },
//   {
//     id;
//   }
// >('resort/removeItem', async params => {
//   const { data } = await apiClient.delete<{
//     accessToken: string;
//     refreshToken: string;
//   }>(getUrlWithParams(urls.api.resorts.delete, { id: params.id }));
//   return data;
// });
