import React from 'react';
import { Form, Layout, Typography } from 'antd';
import { useForm, FormProvider, WatchObserver } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { useQuery } from 'hooks/useQuery';
import { InputField } from 'components/form/base/InputField';
import { CatalogEntityTypesSelect } from 'components/form/selects/CatalogEntityTypesSelect';
import { CatalogFieldTypeSelect } from 'components/form/selects/CatalogFieldTypeSelect';
import { mapSelect } from 'utils/mappings';
import { useDeepEffect } from 'utils/useDeepEffect';
import { debounce, removeEmptyValues } from 'utils/helpers';

interface IFormValues {
  limit: string;
  offset: string;
  nameQuery: string;
  entityType: string | { value: string; label: string };
  fieldType: string | { value: string; label: string };
}

export const Filters = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const updateFilters = filters => {
    const queryString = new URLSearchParams(filters).toString();
    navigate(`${location.pathname}?${queryString}`);
  };

  const debounceSubmit = React.useCallback(
    debounce((values: IFormValues) => {
      const preparedValues = {
        nameQuery: values.nameQuery && values.nameQuery.trim(),
        entityType: mapSelect(values.entityType) as string,
        fieldType: mapSelect(values.fieldType) as string,
      };
      updateFilters(removeEmptyValues(preparedValues));
    }, 500),
    []
  );

  //omit pagination from query
  const { limit, offset, ...filterValues } = query;

  const methods = useForm({
    defaultValues: {
      nameQuery: '',
      entityType: '',
      fieldType: '',
      ...filterValues,
    } as IFormValues,
  });

  React.useEffect(() => {
    const subscription = methods.watch(
      methods.handleSubmit(debounceSubmit) as WatchObserver<IFormValues>
    );
    return () => subscription.unsubscribe();
  }, [methods.handleSubmit, methods.watch]);

  // watch() linked fields, change disciplines on sports change
  const entityTypeValue = methods.watch('entityType');
  useDeepEffect(() => {
    if (methods.formState.isDirty) {
      methods.setValue('fieldType', '');
    }
  }, [entityTypeValue]);

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
            name='nameQuery'
            placeholder='Введите название'
            maxLength={100}
          />
          <CatalogEntityTypesSelect
            name='entityType'
            label='Тип сущности'
            placeholder='Тип сущности'
            withEmptyValue
          />
          <CatalogFieldTypeSelect
            name='fieldType'
            label='Тип поля'
            placeholder='Тип поля'
            entityType={
              typeof entityTypeValue === 'string'
                ? entityTypeValue
                : (entityTypeValue?.value as string)
            }
            withEmptyValue
          />
        </form>
      </FormProvider>
    </Layout.Content>
  );
};
