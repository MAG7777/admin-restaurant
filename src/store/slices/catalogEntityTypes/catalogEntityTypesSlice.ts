import { createSlice } from '@reduxjs/toolkit';

import { loadCatalogEntityTypes } from './actions';

export const catalogEntityTypesSlice = createSlice({
  name: 'catalogEntityTypes',
  initialState: {
    data: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadCatalogEntityTypes.fulfilled, (state, { payload }) => {
      state.data = payload;
    });
  },
});
