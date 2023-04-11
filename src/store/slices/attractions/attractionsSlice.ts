import { createSlice } from '@reduxjs/toolkit';

import { IAttractionsState } from './interfaces';
import { loadAttractionItem, loadAttractionsList } from './actions';

export const attractionsSlice = createSlice({
  name: 'attractions',
  initialState: {
    list: [],
    item: {},
    limit: 20,
    total: 0,
    offset: 0,
  } as IAttractionsState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadAttractionsList.fulfilled,
      (state, { payload: { data, total } }) => {
        state.list = data;
        state.total = total;
      }
    );
    builder.addCase(loadAttractionItem.fulfilled, (state, { payload }) => {
      state.item = payload;
    });
  },
});
