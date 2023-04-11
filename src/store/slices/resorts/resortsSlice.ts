import { createSlice } from '@reduxjs/toolkit';

import { IResortsState } from './interfaces';
import { loadResortItem, loadResortsList } from './actions';

export const resortsSlice = createSlice({
  name: 'resorts',
  initialState: {
    list: [],
    item: {},
    limit: 20,
    total: 0,
    offset: 0,
  } as IResortsState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadResortsList.fulfilled,
      (state, { payload: { data, total } }) => {
        state.list = data;
        state.total = total;
      }
    );
    builder.addCase(loadResortItem.fulfilled, (state, { payload }) => {
      state.item = payload;
    });
  },
});
