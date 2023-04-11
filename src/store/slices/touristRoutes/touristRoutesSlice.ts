import { createSlice } from '@reduxjs/toolkit';

import { ITouristRoutessState } from './interfaces';
import { loadTouristRoutesItem, loadTouristRoutesList } from './actions';

export const touristRoutesSlice = createSlice({
  name: 'touristRoutes',
  initialState: {
    list: [],
    item: {},
    limit: 20,
    total: 0,
    offset: 0,
  } as ITouristRoutessState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loadTouristRoutesList.fulfilled,
      (state, { payload: { data, total } }) => {
        state.list = data;
        state.total = total;
      }
    );
    builder.addCase(loadTouristRoutesItem.fulfilled, (state, { payload }) => {
      state.item = payload;
    });
  },
});
