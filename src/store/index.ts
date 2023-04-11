import { configureStore } from '@reduxjs/toolkit';
import { notification } from 'antd';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { ApiErrors } from 'constants/apiErrors';

import rootReducer from './rootReducer';

const getErrorMessage = action => {
  console.log(action.error, 'error');
  if (action?.error?.code) {
    return ApiErrors[action.error.code] || 'Внутренняя ошибка сервера';
  }
  return 'Внутренняя ошибка сервера';
};

const apiErrorHandler = () => next => action => {
  if (action.type.match(/\/rejected/)) {
    // eslint-disable-next-line no-console
    console.error(action, 'action');
    notification.error({
      message: getErrorMessage(action),
    });
  }
  return next(action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([apiErrorHandler]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
