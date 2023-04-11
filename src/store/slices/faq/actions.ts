import { createAsyncThunk } from '@reduxjs/toolkit';

import { getUrlWithParams, urls } from 'store/api';
import { apiClient } from 'utils/http';

import { FAQItem } from './interfaces';

export const loadFaqList = createAsyncThunk<FAQItem[], unknown>(
  'faq/loadList',
  async params => {
    const { data } = await apiClient.get<FAQItem[]>(urls.api.faq.get, {
      params,
    });

    return data;
  }
);

export const loadFaqItem = createAsyncThunk<FAQItem, string>(
  'faq/loadItem',
  async id => {
    const { data } = await apiClient.get(
      getUrlWithParams(urls.api.faq.getOne, { id })
    );

    return data;
  }
);

export const saveFaqItem = createAsyncThunk<FAQItem, FAQItem>(
  'faq/saveItem',
  async ({ id, ...params }) => {
    if (id) {
      const { data } = await apiClient.patch<FAQItem>(
        getUrlWithParams(urls.api.faq.patch, { id }),
        params
      );

      return data;
    } else {
      const { data } = await apiClient.post<FAQItem>(urls.api.faq.post, params);

      return data;
    }
  }
);
