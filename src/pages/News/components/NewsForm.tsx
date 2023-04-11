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
import { INewsItem } from 'store/slices/news/interfaces';
import { Statuses } from 'constants/status';

import { mapValues, mapValuesToDraft, validationSchema } from './formUtils';

interface IFormValues {
  name: string;
  image: TImage;
  topic: number;
  region: TRegionType;
  tags: number[];
  shortDescription: string;
  content: TContentBlock[];
  status: Statuses;
  source: string;
}

type TProps = {
  initialValues: IFormValues;
  onFinish: (values: IFormValues) => void;
  onSaveDraft?: (values: any) => void;
  cancelButtonHandler: () => void;
  isDraft: boolean;
};

export const NewsForm: React.FC<TProps> = ({
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
    const preparedValues = mapValues(values) as unknown as INewsItem;

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
                label='Название публикации'
                required
                placeholder='Введите название'
                showCount
                maxLength={30}
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={{ span: 24 }} md={{ span: 14 }}>
              <CatalogAsyncSelect
                name='topic'
                label='Тема/рубрика'
                required
                placeholder='Выберите тему'
                requestParams={{
                  entityType: 'news',
                  fieldType: 'topics',
                }}
              />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 10 }}>
              <CatalogRegionSelect
                name='region'
                label='Регион'
                placeholder='Выберите регион'
                required
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <CatalogAsyncSelect
                name='tags'
                label='Теги'
                placeholder='Выберите теги'
                requestParams={{
                  entityType: 'news',
                  fieldType: 'tags',
                }}
                mode='multiple'
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <InputField
                name='shortDescription'
                label='Краткое описание'
                required
                placeholder='Введите описание'
                showCount
                maxLength={50}
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
          <Collapse.Panel header='Описание публикации' key='content'>
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
            <Status status={initialValues.status} withSourceInput />
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
