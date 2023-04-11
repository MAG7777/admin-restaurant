import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';
import { uploadContent, uploadImage, uploadImageArray } from 'utils/upload';

import { IEventsItem } from './interfaces';

type TListResponse = { data: IEventsItem[]; total: number };

export const loadEventsList = createAsyncThunk<
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
>('events/loadList', async (params, { getState }) => {
  const { limit } = getState().events;
  const { data } = await apiClient.get<TListResponse>(urls.api.events.get, {
    params: {
      limit,
      ...params,
    },
  });
  return data;
});

export const loadEventsItem = createAsyncThunk<IEventsItem, string>(
  'events/loadItem',
  async id => {
    const { data } = await apiClient.get<IEventsItem>(
      getUrlWithParams(urls.api.events.getOne, {
        id,
      })
    );
    return data;
  }
);

export const saveEventsItem = createAsyncThunk<IEventsItem, IEventsItem>(
  'events/saveItem',
  async ({ id, ...params }) => {
    const image = await uploadImage(params.image);
    const gallery = await uploadImageArray(params.gallery);
    const content = await uploadContent(params.content);

    if (id) {
      const { data } = await apiClient.patch<IEventsItem>(
        getUrlWithParams(urls.api.events.patch, { id }),
        {
          ...params,
          image,
          gallery,
          content,
        }
      );
      return data;
    } else {
      const { data } = await apiClient.post<IEventsItem>(urls.api.events.post, {
        ...params,
        image,
        gallery,
        content,
      });
      return data;
    }
  }
);

export const saveEventsItemAsDraft = createAsyncThunk<IEventsItem, IEventsItem>(
  'events/saveItem',
  async ({ id, ...params }) => {
    const image = await uploadImage(params.image);
    const gallery = await uploadImageArray(params.gallery);
    const content = await uploadContent(params.content);
    if (id) {
      const { data } = await apiClient.patch<IEventsItem>(
        getUrlWithParams(urls.api.events.draft.patch, { id }),
        {
          ...params,
          image,
          gallery,
          content,
        }
      );
      return data;
    } else {
      const { data } = await apiClient.post<IEventsItem>(
        urls.api.events.draft.post,
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

export const setPublishEvent = createAsyncThunk<void, string>(
  'events/publish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.events.publish.patch, { id })
    );
  }
);

export const setUnPublishEvent = createAsyncThunk<void, string>(
  'events/unPublish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.events.unPublish.patch, { id })
    );
  }
);

export const removeEventsItem = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  {
    id;
  }
>('events/removeItem', async params => {
  const { data } = await apiClient.delete<{
    accessToken: string;
    refreshToken: string;
  }>(getUrlWithParams(urls.api.events.delete, { id: params.id }));
  return data;
});
