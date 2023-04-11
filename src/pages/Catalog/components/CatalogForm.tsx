import React from 'react';
import { Button, Col, Row, Card } from 'antd';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { DefaultOptionType } from 'antd/lib/select';

import {
  ICatalogItem,
  IEditRequestValues,
} from 'store/slices/catalog/interfaces';
import { InputField } from 'components/form/base/InputField';
import { useDeepEffect } from 'utils/useDeepEffect';
import { CatalogEntityTypesSelect } from 'components/form/selects/CatalogEntityTypesSelect';
import { CatalogFieldTypeSelect } from 'components/form/selects/CatalogFieldTypeSelect';
import { useDeepDidMountEffect } from 'utils/useDeepDidMountEffect';
import { mapSelect } from 'utils/mappings';

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Введите от 1 до 100 символов')
    .max(100, 'Введите от 1 до 100 символов')
    .required('Это поле необходимо заполнить'),
  entityType: Yup.mixed().required('Это поле необходимо заполнить'),
  fieldType: Yup.mixed().required('Это поле необходимо заполнить'),
});

interface IFormValues {
  id?: number;
  name: string;
  entityType: string | DefaultOptionType;
  fieldType: string | DefaultOptionType;
}

type TProps = {
  initialValues: IFormValues;
  onFinish: (values: ICatalogItem | IEditRequestValues) => void;
  cancelButtonHandler: () => void;
};

export const CatalogForm: React.FC<TProps> = ({
  initialValues,
  onFinish,
  cancelButtonHandler,
}) => {
  const resolver = yupResolver(validationSchema);

  const methods = useForm({
    defaultValues: initialValues,
    resolver,
  });

  const isEditForm = Boolean(initialValues.id);

  const submit = values => {
    if (!isEditForm) {
      const preparedValues: ICatalogItem = {
        name: values.name.trim(),
        entityType: mapSelect(values.entityType) as string,
        fieldType: mapSelect(values.fieldType) as string,
      };
      onFinish(preparedValues);
    } else {
      const preparedValues: IEditRequestValues = {
        id: initialValues.id,
        name: values.name.trim(),
      };
      onFinish(preparedValues);
    }
  };

  useDeepEffect(() => {
    methods.reset(initialValues);
  }, [initialValues]);

  const entityTypeValue = methods.watch('entityType');

  useDeepDidMountEffect(() => {
    if (methods.formState.isDirty) {
      methods.setValue('fieldType', null);
    }
  }, [entityTypeValue]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className='ant-form ant-form-vertical indent-top'
      >
        <Card title='Общая информация' bordered={false}>
          <InputField
            name='name'
            required
            placeholder='Введите название'
            showCount
            maxLength={100}
          />
          <Row gutter={[16, 0]}>
            <Col lg={{ span: 9 }} xs={{ span: 24 }}>
              <CatalogEntityTypesSelect
                name='entityType'
                label='Тип сущности'
                required
                placeholder='Выберите тип сущности'
                disabled={isEditForm}
              />
            </Col>
            <Col lg={{ span: 9 }} xs={{ span: 24 }}>
              <CatalogFieldTypeSelect
                name='fieldType'
                required
                label='Тип поля'
                placeholder='Выберите тип поля'
                disabled={isEditForm || !entityTypeValue}
                entityType={
                  typeof entityTypeValue === 'string'
                    ? entityTypeValue
                    : (entityTypeValue?.value as string)
                }
              />
            </Col>
          </Row>
          <Row justify='end' style={{ marginTop: '24px', gap: '18px' }}>
            <Button onClick={cancelButtonHandler}>Отмена</Button>
            <Button type='primary' htmlType='submit'>
              Сохранить
            </Button>
          </Row>
        </Card>
      </form>
    </FormProvider>
  );
};
