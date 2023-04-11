import axios, { AxiosError, AxiosResponse } from 'axios';

import { urls } from 'store/api';

import { JWTService } from './jwt';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Secure-Fgp': '',
  },
});

apiClient.interceptors.response.use(
  async response => {
    return response;
  },
  async (error): Promise<AxiosError | AxiosResponse> => {
    const originalRequest = error.config;
    if (!error.response.data) {
      return Promise.reject({
        code: '',
        message: '',
        ...error,
      } as AxiosError);
    }
    if (
      error.response.status === 401 &&
      originalRequest.url === urls.api.auth.refreshToken.post
    ) {
      JWTService.clear();
      window.location.replace('/');
      return Promise.reject(error);
    }
    if (
      error.response.status === 401 &&
      originalRequest.url !== urls.api.auth.login.post &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      return apiClient
        .post<{
          accessToken: string;
          refreshToken: string;
        }>(urls.api.auth.refreshToken.post, {
          refreshToken: JWTService.getRefreshToken(),
        })
        .then(({ data: { accessToken, refreshToken } }) => {
          setAuthorizationToken(accessToken);
          JWTService.setAccessToken(accessToken);
          JWTService.setRefreshToken(refreshToken);
          return apiClient({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${JWTService.getAccessToken()}`,
            },
          });
        });
    }
    return Promise.reject({
      ...error,
      code: error.response.data.code,
      message: error.response.data.message,
    } as AxiosError);
  }
);

export const setAuthorizationToken = (token: string): void => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

if (JWTService.getAccessToken()) {
  setAuthorizationToken(JWTService.getAccessToken());
}
