import { createSlice } from '@reduxjs/toolkit';

import { IEventsState } from './interfaces';
import { loadEventsItem, loadEventsList } from './actions';

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    item: {},
    limit: 20,
    total: 0,
    offset: 0,
  } as IEventsState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadEventsList.fulfilled,
      (state, { payload: { data, total } }) => {
        state.list = data;
        state.total = total;
      }
    );
    builder.addCase(loadEventsItem.fulfilled, (state, { payload }) => {
      state.item = payload;
    });
  },
});
