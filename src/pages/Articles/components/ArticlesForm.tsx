import React from 'react';
import { Button, Col, Collapse, Row, Card } from 'antd';
import { useForm, FormProvider, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputField } from 'components/form/base/InputField';
import { useDeepEffect } from 'utils/useDeepEffect';
import { MainImage } from 'components/form/MainImage/MainImage';
import { Content } from 'components/form/Content/Content';
import {
  CatalogRegionSelect,
  TRegionType,
} from 'components/form/selects/CatalogRegionSelect';
import { CatalogAsyncSelect } from 'components/form/selects/CatalogAsyncSelect';
import { Status } from 'components/form/Status/Status';
import { TImage } from 'types/image';
import { TContentBlock } from 'components/form/Content/contentTypes';
import { isEmpty } from 'utils/helpers';
import { FormActions } from 'components/Layout/FormActions/FormActions';
import { IArticlesItem } from 'store/slices/articles/interfaces';
import { Statuses } from 'constants/status';

import { mapValues, mapValuesToDraft, validationSchema } from './formUtils';

interface IFormValues {
  name: string;
  image: TImage;
  shortName: string;
  category: number;
  tags: number[];
  region: TRegionType;
  content: TContentBlock[];
  status: Statuses;
}

type TProps = {
  initialValues: IFormValues;
  onFinish: (values: IFormValues) => void;
  onSaveDraft: (values: any) => void;
  cancelButtonHandler: () => void;
  isDraft: boolean;
};

export const ArticlesForm: React.FC<TProps> = ({
  initialValues,
  onFinish,
  onSaveDraft,
  cancelButtonHandler,
  isDraft,
}) => {
  const [activeCollpaseTabs, setActiveCollpaseTabs] = React.useState([
    'content',
    'description',
    'seo',
    'status',
  ]);
  const resolver = yupResolver(validationSchema);

  const methods = useForm({
    defaultValues: initialValues,
    resolver,
  });

  const handleSaveAsDraft = () => {
    const formValues = mapValuesToDraft(methods.getValues());
    onSaveDraft(formValues as any);
  };

  const submit = (values: FieldValues) => {
    const preparedValues = mapValues(values) as unknown as IArticlesItem;

    onFinish(preparedValues);
  };

  useDeepEffect(() => {
    methods.reset(initialValues);
  }, [initialValues]);

  useDeepEffect(() => {
    if (!isEmpty(methods.formState.errors)) {
      setActiveCollpaseTabs([
        ...Array.from(
          new Set([
            ...activeCollpaseTabs,
            ...Object.keys(methods.formState.errors),
          ])
        ),
      ]);
    }
  }, [methods.formState.errors]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className='ant-form ant-form-vertical indent-top'
      >
        <Card title='Общая информация' bordered={false}>
          <Row gutter={[16, 0]}>
            <Col flex={'0 0 100px'}>
              <MainImage name='image' label='Глав. фото' required />
            </Col>
            <Col flex={1} style={{ minWidth: 300 }}>
              <InputField
                name='name'
                label='Название статьи'
                required
                placeholder='Введите название'
                showCount
                maxLength={255}
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <InputField
                name='shortName'
                label='Краткое название статьи'
                required
                placeholder='Введите название'
                showCount
                maxLength={80}
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <CatalogAsyncSelect
                name='category'
                label='Категория'
                required
                placeholder='Выберите категорию'
                requestParams={{
                  entityType: 'articles',
                  fieldType: 'categories',
                }}
              />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              <CatalogAsyncSelect
                name='tags'
                label='Теги'
                placeholder='Выберите теги'
                requestParams={{
                  entityType: 'articles',
                  fieldType: 'tags',
                }}
                mode='multiple'
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={{ span: 24 }} md={{ span: 10 }}>
              <CatalogRegionSelect
                name='region'
                label='Регион'
                placeholder='Выберите регион'
                required
              />
            </Col>
          </Row>
        </Card>
        <Collapse
          bordered={false}
          expandIconPosition='end'
          onChange={value => setActiveCollpaseTabs(value as string[])}
          activeKey={activeCollpaseTabs}
        >
          <Collapse.Panel header='Описание статьи' key='content'>
            <Row>
              <Col span={24}>
                <Content
                  name='content'
                  label='Описание'
                  placeholder='Начните печатать текст'
                  withWidgetsDescription
                  withPreparingForModeration
                  required
                />
              </Col>
            </Row>
          </Collapse.Panel>
          <Collapse.Panel header='Публикация' key='status'>
            <Status status={initialValues.status} />
          </Collapse.Panel>
        </Collapse>
        <FormActions>
          <Button onClick={cancelButtonHandler}>Отмена</Button>
          {isDraft && (
            <Button onClick={handleSaveAsDraft}>Сохранить как черновик</Button>
          )}
          <Button type='primary' htmlType='submit'>
            Сохранить
          </Button>
        </FormActions>
      </form>
    </FormProvider>
  );
};
