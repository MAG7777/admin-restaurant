import React from 'react';
import { Layout, Typography } from 'antd';
import { useForm, FormProvider, WatchObserver } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { useQuery } from 'hooks/useQuery';
import { InputField } from 'components/form/base/InputField';
import { mapRegionForFilters, mapSelect } from 'utils/mappings';
import { debounce, omit, removeEmptyValues } from 'utils/helpers';
import { statusesNamesHash } from 'constants/status';
import { Select } from 'components/form/base/Select';
import { CatalogAsyncSelect } from 'components/form/selects/CatalogAsyncSelect';
import { AuthorAsyncSelect } from 'components/form/selects/AuthorAsyncSelect';
import { CatalogRegionSelect } from 'components/form/selects/CatalogRegionSelect';

type TFormSelectValue = { value: string; label: string };

interface IFormValues {
  name: string;
  status: string | TFormSelectValue;
  tags: string[] | TFormSelectValue[];
  regionFiasIds: string[] | TFormSelectValue[];
  authors: string[] | TFormSelectValue[];
}

export const Filters: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const updateFilters = filters => {
    const queryString = new URLSearchParams(filters).toString();
    navigate(`${location.pathname}?${queryString}`);
  };

  const debounceSubmit = React.useCallback(
    debounce((values: IFormValues) => {
      const preparedValues = {
        name: values.name && values.name.trim(),
        status: mapSelect(values.status),
        tags: values.tags.length ? mapSelect(values.tags) : null,
        authors: values.authors.length ? mapSelect(values.authors) : null,
        regionFiasIds: values.regionFiasIds.length
          ? mapRegionForFilters(values.regionFiasIds)
          : null,
      };
      updateFilters(removeEmptyValues(preparedValues));
    }, 500),
    []
  );

  const methods = useForm({
    defaultValues: {
      name: '',
      status: '',
      tags: [],
      regionFiasIds: [],
      authors: [],
      ...omit(query, 'limit', 'offset'),
    },
  });

  React.useEffect(() => {
    const subscription = methods.watch(
      methods.handleSubmit(debounceSubmit) as WatchObserver<IFormValues>
    );
    return () => subscription.unsubscribe();
  }, [methods.handleSubmit, methods.watch]);

  return (
    <Layout.Content
      style={{ background: '#fff', paddingTop: '16px', paddingBottom: '1px' }}
    >
      <Typography.Title level={5} style={{ marginBottom: '24px' }}>
        Фильтры
      </Typography.Title>
      <FormProvider {...methods}>
        <form className='ant-form ant-form-vertical'>
          <InputField
            name='name'
            placeholder='Введите название'
            maxLength={255}
          />
          <Select
            name='status'
            label='Статус'
            options={[
              { value: '', label: 'Все' },
              ...Object.keys(statusesNamesHash).map(item => {
                return {
                  value: item,
                  label: statusesNamesHash[item],
                };
              }),
            ]}
          />
          <CatalogAsyncSelect
            name='tags'
            label='Tеги'
            requestParams={{
              entityType: 'news',
              fieldType: 'tags',
            }}
            mode='multiple'
            placeholder='Выберите тег'
          />
          <AuthorAsyncSelect
            name='authors'
            label='Автор'
            mode='multiple'
            placeholder='Выберите автора'
          />
          <CatalogRegionSelect
            name='regionFiasIds'
            label='Регион'
            mode='multiple'
            placeholder='Выберите регион'
          />
        </form>
      </FormProvider>
    </Layout.Content>
  );
};
