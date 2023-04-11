import { createSlice } from '@reduxjs/toolkit';

import { INewsState } from './interfaces';
import { loadNewsItem, loadNewsList } from './actions';

export const newsSlice = createSlice({
  name: 'news',
  initialState: {
    list: [],
    item: {},
    limit: 20,
    total: 0,
    offset: 0,
  } as INewsState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadNewsList.fulfilled,
      (state, { payload: { data, total } }) => {
        state.list = data;
        state.total = total;
      }
    );
    builder.addCase(loadNewsItem.fulfilled, (state, { payload }) => {
      state.item = payload;
    });
  },
});
