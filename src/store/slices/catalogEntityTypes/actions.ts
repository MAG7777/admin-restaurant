import { createAsyncThunk } from '@reduxjs/toolkit';

import { urls } from 'store/api';
import { apiClient } from 'utils/http';

export const loadCatalogEntityTypes = createAsyncThunk<any>(
  'catalogEntityTypes/load',
  async () => {
    const { data } = await apiClient.get(urls.api.catalog.relations.get);
    return data;
  }
);
