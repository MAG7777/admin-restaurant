import React, { useCallback, useEffect } from 'react';
import { Layout, Typography } from 'antd';
import { FormProvider, useForm, WatchObserver } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { InputField } from 'components/form/base/InputField';
import { Select } from 'components/form/base/Select';
import { useQuery } from 'hooks/useQuery';
import { debounce, removeEmptyValues } from 'utils/helpers';
import { mapSelect } from 'utils/mappings';

import { CATEGORY_OPTIONS, FAQCategoryOption } from '../FAQForm';

const FILTER_OPTIONS: FAQCategoryOption[] = [
  { value: '', label: 'Все' },
  ...CATEGORY_OPTIONS,
];

interface FilterValues {
  question: string;
  category: FAQCategoryOption;
}

export const Filters = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const methods = useForm<FilterValues>({
    defaultValues: {
      question: '',
      category: FILTER_OPTIONS[0],
      ...query,
    },
  });

  const updateFilters = (filterValues: Record<string, string>) => {
    const queryString = new URLSearchParams(filterValues).toString();
    navigate(`${location.pathname}?${queryString}`);
  };

  const debounceSubmit = useCallback(
    debounce(({ category, question }: FilterValues) => {
      const preparedValues = {
        question,
        category: mapSelect(category.value),
      };
      updateFilters(removeEmptyValues(preparedValues));
    }, 500),
    []
  );

  useEffect(() => {
    const subscription = methods.watch(
      methods.handleSubmit(
        debounceSubmit
      ) as unknown as WatchObserver<FilterValues>
    );
    return () => subscription.unsubscribe();
  }, [methods.handleSubmit, methods.watch]);

  return (
    <Layout.Content
      style={{ background: '#fff', paddingTop: 16, paddingBottom: 1 }}
    >
      <Typography.Title level={5} style={{ marginBottom: 24 }}>
        Фильтры
      </Typography.Title>
      <FormProvider {...methods}>
        <form className='ant-form-vertical'>
          <InputField
            name='question'
            placeholder='Введите вопрос'
            label='Вопрос'
            maxLength={255}
          />
          <Select label='Категория' name='category' options={FILTER_OPTIONS} />
        </form>
      </FormProvider>
    </Layout.Content>
  );
};

export default Filters;
