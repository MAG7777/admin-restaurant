import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';
import { uploadContent, uploadImage } from 'utils/upload';

import { INewsItem } from './interfaces';

type TListResponse = {
  data: INewsItem[];
  total: number;
};

export const loadNewsList = createAsyncThunk<
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
>('news/loadList', async (params, { getState }) => {
  const { limit } = getState().news;
  const { data } = await apiClient.get<TListResponse>(urls.api.news.get, {
    params: {
      limit,
      ...params,
    },
  });
  return data;
});

export const loadNewsItem = createAsyncThunk<INewsItem, string>(
  'news/loadItem',
  async id => {
    const { data } = await apiClient.get<INewsItem>(
      getUrlWithParams(urls.api.news.getOne, {
        id,
      })
    );
    return data;
  }
);

export const saveNewsItem = createAsyncThunk<INewsItem, INewsItem>(
  'news/saveItem',
  async ({ id, ...params }) => {
    const image = await uploadImage(params.image);
    const content = await uploadContent(params.content);

    if (id) {
      const { data } = await apiClient.patch<INewsItem>(
        getUrlWithParams(urls.api.news.patch, { id }),
        {
          ...params,
          image,
          content,
        }
      );
      return data;
    } else {
      const { data } = await apiClient.post<INewsItem>(urls.api.news.post, {
        ...params,
        image,
        content,
      });
      return data;
    }
  }
);

export const saveNewsItemAsDraft = createAsyncThunk<INewsItem, INewsItem>(
  'news/saveItem',
  async ({ id, ...params }) => {
    const image = await uploadImage(params.image);
    const content = await uploadContent(params.content);

    if (id) {
      const { data } = await apiClient.patch<INewsItem>(
        getUrlWithParams(urls.api.news.draft.patch, { id }),
        {
          ...params,
          image,
          content,
        }
      );
      return data;
    } else {
      const { data } = await apiClient.post<INewsItem>(
        urls.api.news.draft.post,
        {
          ...params,
          image,
          content,
        }
      );
      return data;
    }
  }
);

export const removeNewsItem = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  {
    id: string;
  }
>('news/removeItem', async params => {
  const { data } = await apiClient.delete<{
    accessToken: string;
    refreshToken: string;
  }>(getUrlWithParams(urls.api.news.delete, { id: params.id }));
  return data;
});

export const setPublishNew = createAsyncThunk<void, string>(
  'news/publish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.news.publish.patch, { id })
    );
  }
);

export const setUnPublishNew = createAsyncThunk<void, string>(
  'news/unPublish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.news.unPublish.patch, { id })
    );
  }
);
