import { createSlice } from '@reduxjs/toolkit';

import { loadFaqItem, loadFaqList } from './actions';
import { FAQState } from './interfaces';

export const faqSlice = createSlice({
  name: 'faq',
  initialState: {
    list: [],
    item: null,
  } as FAQState,
  reducers: {
    setItem(state, { payload }) {
      state.item = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadFaqList.fulfilled, (state, { payload }) => {
      state.list = payload;
    });
    builder.addCase(loadFaqItem.fulfilled, (state, { payload }) => {
      state.item = payload;
    });
  },
});

export const { setItem } = faqSlice.actions;
