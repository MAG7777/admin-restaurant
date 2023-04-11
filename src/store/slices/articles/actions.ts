import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';
import { uploadContent, uploadImage } from 'utils/upload';

import { IArticlesItem } from './interfaces';

type TListResponse = {
  data: IArticlesItem[];
  total: number;
};

export const loadArticlesList = createAsyncThunk<
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
>('articles/loadList', async (params, { getState }) => {
  const { limit } = getState().articles;
  const { data } = await apiClient.get<TListResponse>(urls.api.articles.get, {
    params: {
      limit,
      ...params,
    },
  });
  return data;
});

export const loadArticlesItem = createAsyncThunk<IArticlesItem, string>(
  'articles/loadItem',
  async id => {
    const { data } = await apiClient.get<IArticlesItem>(
      getUrlWithParams(urls.api.articles.getOne, {
        id,
      })
    );
    return data;
  }
);

export const saveArticlesItem = createAsyncThunk<IArticlesItem, IArticlesItem>(
  'articles/saveItem',
  async ({ id, ...params }) => {
    const image = await uploadImage(params.image);
    const content = await uploadContent(params.content);

    if (id) {
      const { data } = await apiClient.patch<IArticlesItem>(
        getUrlWithParams(urls.api.articles.patch, { id }),
        {
          ...params,
          image,
          content,
        }
      );
      return data;
    } else {
      const { data } = await apiClient.post<IArticlesItem>(
        urls.api.articles.post,
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

export const saveArticlesItemAsDraft = createAsyncThunk<
  IArticlesItem,
  IArticlesItem
>('articles/saveItem', async ({ id, ...params }) => {
  const image = await uploadImage(params.image);
  const content = await uploadContent(params.content);

  if (id) {
    const { data } = await apiClient.patch<IArticlesItem>(
      getUrlWithParams(urls.api.articles.draft.patch, { id }),
      {
        ...params,
        image,
        content,
      }
    );
    return data;
  } else {
    const { data } = await apiClient.post<IArticlesItem>(
      urls.api.articles.draft.post,
      {
        ...params,
        image,
        content,
      }
    );
    return data;
  }
});

export const removeArticlesItem = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  {
    id: string;
  }
>('articles/removeItem', async params => {
  const { data } = await apiClient.delete<{
    accessToken: string;
    refreshToken: string;
  }>(getUrlWithParams(urls.api.articles.delete, { id: params.id }));

  return data;
});

export const setPublishArticle = createAsyncThunk<void, string>(
  'articles/publish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.articles.publish.patch, { id })
    );
  }
);

export const setUnPublishArticle = createAsyncThunk<void, string>(
  'articles/unPublish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.articles.unPublish.patch, { id })
    );
  }
);
