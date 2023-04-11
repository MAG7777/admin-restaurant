import { createAsyncThunk } from '@reduxjs/toolkit';

import { urls } from 'store/api';
import { apiClient } from 'utils/http';

export const registration = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  {
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
  }
>('auth/registration', async params => {
  const { data } = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>(urls.api.auth.register.post, {
    email: params.email,
    password: params.password,
    passwordConfirm: params.passwordConfirm,
    adminData: {
      firstName: params.firstName,
      lastName: params.lastName,
    },
    userType: 'admin',
  });
  return data;
});

export const registerEmailRetry = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  string
>('auth/register-email-retry', async email => {
  const { data } = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>(urls.api.auth.registerEmailRetry.post, {
    email: email,
    userType: 'admin',
  });
  return data;
});

export const signIn = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  { email: string; password: string }
>('auth/login', async params => {
  const { data } = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>(urls.api.auth.login.post, {
    email: params.email,
    password: params.password,
    userType: 'admin',
  });
  return data;
});

export const emailConfirm = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  {
    email: string;
    emailConfirmToken: string;
    userType: string;
  }
>('auth/email-confirm', async params => {
  const { data } = await apiClient.get<{
    accessToken: string;
    refreshToken: string;
  }>(urls.api.auth.emailConfirm.get, {
    params: {
      email: params.email,
      emailConfirmToken: params.emailConfirmToken,
      userType: params.userType,
    },
  });
  return data;
});

export const passwordResetConfirm = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  {
    email: string;
    passwordResetToken: string;
    newPassword: string;
    newPasswordConfirm: string;
    userType: string;
  }
>('auth/password-reset-confirm', async params => {
  const { data } = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>(urls.api.auth.passwordResetConfirm.post, {
    email: params.email,
    passwordResetToken: params.passwordResetToken,
    newPassword: params.newPassword,
    newPasswordConfirm: params.newPasswordConfirm,
    userType: params.userType,
  });
  return data;
});

export const passwordResetRequest = createAsyncThunk<
  undefined,
  {
    email: string;
  }
>('auth/password-reset-request', async params => {
  const { data } = await apiClient.get(urls.api.auth.passwordResetRequest.get, {
    params: {
      email: params.email,
      userType: 'admin',
    },
  });
  return data;
});
