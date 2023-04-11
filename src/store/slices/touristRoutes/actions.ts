import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from 'store';
import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';
import { uploadContent, uploadImage } from 'utils/upload';

import { ITouristRoutesDraftItem, ITouristRoutesItem } from './interfaces';

type TListResponse = { data: ITouristRoutesItem[]; total: number };

export const loadTouristRoutesList = createAsyncThunk<
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
>('touristRoutes/loadList', async (params, { getState }) => {
  const { limit } = getState().touristRoutes;
  const { data } = await apiClient.get<TListResponse>(urls.api.routes.get, {
    params: {
      limit,
      ...params,
    },
  });
  return data;
});

export const loadTouristRoutesItem = createAsyncThunk<
  ITouristRoutesItem,
  string
>('touristRoutes/loadItem', async id => {
  const { data } = await apiClient.get<ITouristRoutesItem>(
    getUrlWithParams(urls.api.routes.getOne, {
      id,
    })
  );
  return data;
});

export const saveTouristRoutesItem = createAsyncThunk<
  ITouristRoutesItem,
  ITouristRoutesItem
>('touristRoutes/saveItem', async ({ id, ...params }) => {
  const image = await uploadImage(params.image);
  const content = await uploadContent(params.content);
  const imageUploadResult = await Promise.all(
    params.points.map(item => uploadImage(item[item.type].image))
  );
  const contentUploadResult = await Promise.all(
    params.points.map(item => uploadContent(item[item.type].description))
  );
  const points = params.points.map((item, index) => {
    return {
      type: item.type,
      [item.type]: {
        ...item[item.type],
        description: contentUploadResult[index],
        ...(item[item.type].image && {
          image: imageUploadResult[index],
        }),
      },
    };
  });
  if (id) {
    const { data } = await apiClient.patch<ITouristRoutesItem>(
      getUrlWithParams(urls.api.routes.patch, { id }),
      {
        ...params,
        image,
        content,
        points,
      }
    );
    return data;
  } else {
    const { data } = await apiClient.post<ITouristRoutesItem>(
      urls.api.routes.post,
      {
        ...params,
        image,
        content,
        points,
      }
    );
    return data;
  }
});

export const saveTouristRoutesItemAsDraft = createAsyncThunk<
  ITouristRoutesItem,
  ITouristRoutesDraftItem
>('touristRoutes/saveItem', async ({ id, ...params }) => {
  const image = await uploadImage(params.image);
  const content = await uploadContent(params.content);
  const imageUploadResult = await Promise.all(
    params.points.map(item => uploadImage(item[item.type].image))
  );
  const contentUploadResult = await Promise.all(
    params.points.map(item => uploadContent(item[item.type].description))
  );
  const points = params.points.map((item, index) => {
    return {
      type: item.type,
      [item.type]: {
        ...item[item.type],
        description: contentUploadResult[index],
        ...(item[item.type].image && {
          image: imageUploadResult[index],
        }),
      },
    };
  });
  if (id) {
    const { data } = await apiClient.patch<ITouristRoutesItem>(
      getUrlWithParams(urls.api.routes.draft.patch, { id }),
      {
        ...params,
        image,
        content,
        points,
      }
    );
    return data;
  } else {
    const { data } = await apiClient.post<ITouristRoutesItem>(
      urls.api.routes.draft.post,
      {
        ...params,
        image,
        points,
        content,
      }
    );
    return data;
  }
});

export const setPublishTouristRoutes = createAsyncThunk<void, string>(
  'touristRoutes/publish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.routes.publish.patch, { id })
    );
  }
);

export const setUnPublishTouristRoutes = createAsyncThunk<void, string>(
  'touristRoutes/unPublish',
  async id => {
    return await apiClient.patch(
      getUrlWithParams(urls.api.routes.unPublish.patch, { id })
    );
  }
);

// export const removeTouristRoutesItem = createAsyncThunk<
//   {
//     accessToken: string;
//     refreshToken: string;
//   },
//   {
//     id;
//   }
// >('route/removeItem', async params => {
//   const { data } = await apiClient.delete<{
//     accessToken: string;
//     refreshToken: string;
//   }>(getUrlWithParams(urls.api.route.delete, { id: params.id }));
//   return data;
// });
