import { createSlice } from '@reduxjs/toolkit';

import { Roles } from 'constants/roles';
import { JWTService } from 'utils/jwt';
import { setAuthorizationToken } from 'utils/http';

import { IAccountState } from './interfaces';
import {
  emailConfirm,
  passwordResetConfirm,
  registration,
  signIn,
} from './actions';

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    role: Roles.Unauthorized,
    ...JWTService.decode(JWTService.getAccessToken()),
  } as IAccountState,
  reducers: {
    signOut(state) {
      JWTService.clear();
      Object.keys(state)
        .filter(k => k !== 'role')
        .forEach(k => delete state[k]);
      state.role = Roles.Unauthorized;
      setAuthorizationToken(null);
    },
  },
  extraReducers: builder => {
    builder.addCase(
      registration.fulfilled,
      (state, { payload: { accessToken, refreshToken } }) => {
        JWTService.setAccessToken(accessToken);
        JWTService.setRefreshToken(refreshToken);
        const data = JWTService.decode(accessToken);
        Object.keys(data).forEach(key => (state[key] = data[key]));
        setAuthorizationToken(accessToken);
      }
    );
    builder.addCase(
      signIn.fulfilled,
      (state, { payload: { accessToken, refreshToken } }) => {
        JWTService.setAccessToken(accessToken);
        JWTService.setRefreshToken(refreshToken);
        const data = JWTService.decode(accessToken);
        Object.keys(data).forEach(key => (state[key] = data[key]));
        setAuthorizationToken(accessToken);
      }
    );
    builder.addCase(
      passwordResetConfirm.fulfilled,
      (state, { payload: { accessToken, refreshToken } }) => {
        JWTService.setAccessToken(accessToken);
        JWTService.setRefreshToken(refreshToken);
        const data = JWTService.decode(accessToken);
        Object.keys(data).forEach(key => (state[key] = data[key]));
        setAuthorizationToken(accessToken);
      }
    );
    builder.addCase(
      emailConfirm.fulfilled,
      (state, { payload: { accessToken, refreshToken } }) => {
        JWTService.setAccessToken(accessToken);
        JWTService.setRefreshToken(refreshToken);
        const data = JWTService.decode(accessToken);
        Object.keys(data).forEach(key => (state[key] = data[key]));
        setAuthorizationToken(accessToken);
      }
    );
  },
});

export const { signOut } = accountSlice.actions;
