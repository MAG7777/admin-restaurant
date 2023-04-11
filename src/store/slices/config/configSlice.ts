import { createSlice } from '@reduxjs/toolkit';

import { loadConfig } from './actions';
import { IConfigState } from './interfaces';

export const attractionsSlice = createSlice({
  name: 'config',
  initialState: {
    config: {},
  } as IConfigState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadConfig.fulfilled, (state, { payload }) => {
      state.config = payload;
    });
  },
});
