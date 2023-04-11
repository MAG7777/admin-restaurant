import { createSlice } from '@reduxjs/toolkit';

import { IArticlesState } from './interfaces';
import { loadArticlesItem, loadArticlesList } from './actions';

export const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    list: [],
    item: {},
    limit: 20,
    total: 0,
    offset: 0,
  } as IArticlesState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadArticlesList.fulfilled,
      (state, { payload: { data, total } }) => {
        state.list = data;
        state.total = total;
      }
    );
    builder.addCase(loadArticlesItem.fulfilled, (state, { payload }) => {
      state.item = payload;
    });
  },
});
