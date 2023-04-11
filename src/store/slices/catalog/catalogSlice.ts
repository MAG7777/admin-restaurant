import { createSlice } from '@reduxjs/toolkit';

import { ICatalogState } from './interfaces';
import { loadCatalogItem, loadCatalogList } from './actions';

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    list: [],
    item: {},
    limit: 20,
    total: 0,
    offset: 0,
  } as ICatalogState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadCatalogList.fulfilled,
      (state, { payload: { data, total } }) => {
        state.list = data;
        state.total = total;
      }
    );
    builder.addCase(loadCatalogItem.fulfilled, (state, { payload }) => {
      state.item = payload;
    });
  },
});
