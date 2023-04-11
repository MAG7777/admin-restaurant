import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';
import { uploadContent, uploadImage, uploadImageArray } from 'utils/upload';

import { IAttractionItem, IAttractionItemResponse } from './interfaces';

type TListResponse = { data: IAttractionItemResponse[]; total: number };

export const loadAttractionsList = createAsyncThunk<
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
>('attractions/loadList', async (params, { getState }) => {
  const { limit } = getState().attractions;
  const { data } = await apiClient.get<TListResponse>(
    urls.api.attractions.get,
    {
      params: {
        limit,
        ...params,
      },
    }
  );
  return data;
});

export const loadAttractionItem = createAsyncThunk<
  IAttractionItemResponse,
  string
>('attraction/loadItem', async id => {
  const { data } = await apiClient.get<IAttractionItemResponse>(
    getUrlWithParams(urls.api.attractions.getOne, {
      id,
    })
  );
  return data;
});

export const saveAttractionItem = createAsyncThunk<
  IAttractionItem,
  IAttractionItem
>('attraction/saveItem', async ({ id, ...params }) => {
  const image = await uploadImage(params.image);
  const gallery = await uploadImageArray(params.gallery);
  const content = await uploadContent(params.content);

  if (id) {
    const { data } = await apiClient.patch<IAttractionItem>(
      getUrlWithParams(urls.api.attractions.patch, { id }),
      {
        ...params,
        image,
        gallery,
        content,
      }
    );
    return data;
  } else {
    const { data } = await apiClient.post<IAttractionItem>(
      urls.api.attractions.post,
      {
        ...params,
        image,
        gallery,
        content,
      }
    );
    return data;
  }
});

export const saveAttractionItemAsDraft = createAsyncThunk<
  IAttractionItem,
  IAttractionItem
>('attraction/saveItem', async params => {
  const { id, ...requestParams } = params;
  const image = await uploadImage(requestParams.image);
  const gallery = await uploadImageArray(requestParams.gallery);
  const content = await uploadContent(requestParams.content);
  if (id) {
    const { data } = await apiClient.patch<IAttractionItem>(
      getUrlWithParams(urls.api.attractions.draft.patch, { id }),
      {
        ...requestParams,
        image,
        gallery,
        content,
      }
    );
    return data;
  } else {
    const { data } = await apiClient.post<IAttractionItem>(
      urls.api.attractions.draft.post,
      {
        ...requestParams,
        image,
        gallery,
        content,
      }
    );
    return data;
  }
});

export const setPublishAttraction = createAsyncThunk<void, string>(
  'attractions/publish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.attractions.publish.patch, { id })
    );
  }
);

export const setUnPublishAttraction = createAsyncThunk<void, string>(
  'attractions/unPublish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.attractions.unPublish.patch, { id })
    );
  }
);

// export const removeattractionItem = createAsyncThunk<
//   {
//     accessToken: string;
//     refreshToken: string;
//   },
//   {
//     id;
//   }
// >('attraction/removeItem', async params => {
//   const { data } = await apiClient.delete<{
//     accessToken: string;
//     refreshToken: string;
//   }>(getUrlWithParams(urls.api.attraction.delete, { id: params.id }));
//   return data;
// });
