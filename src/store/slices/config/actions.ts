import { createAsyncThunk } from '@reduxjs/toolkit';

// import { urls } from 'store/api';
// import { apiClient } from 'utils/http';

export const loadConfig = createAsyncThunk<
  any,
  {
    limit?: number;
    offset?: number;
    tags?: string;
  }
>('attractions/loadList', async (params, { getState }) => {
  const data = {
    yandexId: 'test',
  };
  return data;
});
