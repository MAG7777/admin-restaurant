import React from 'react';
import { Button, Col, Collapse, Row, Card } from 'antd';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GlobalOutlined } from '@ant-design/icons';

import { TContentBlock } from 'components/form/Content/contentTypes';
import { InputField } from 'components/form/base/InputField';
import { useDeepEffect } from 'utils/useDeepEffect';
import { MainImage } from 'components/form/MainImage/MainImage';
import { Content } from 'components/form/Content/Content';
import { Status } from 'components/form/Status/Status';
import { TImage } from 'types/image';
import { CatalogAsyncSelect } from 'components/form/selects/CatalogAsyncSelect';
import { FormActions } from 'components/Layout/FormActions/FormActions';
import { isEmpty } from 'utils/helpers';
import { UploadAudio } from 'components/form/UploadAudio/UploadAudio';
import { TouristRoutePoints } from 'components/form/TouristRoutePoints/TouristRoutePoints';
import { TAudio } from 'types/audio';
import { CreateRouteMap } from 'components/form/CreateRouteMap/CreateRouteMap';
import { Statuses } from 'constants/status';
import {
  ITouristRoutesDraftItem,
  ITouristRoutesItem,
} from 'store/slices/touristRoutes/interfaces';
import { DurationField } from 'components/form/DurationField/DurationField';

import { mapValues, mapValuesToDraft, validationSchema } from './formUtils';

interface IFormValues {
  name: string;
  tags: number[];
  image: TImage;
  shortDescription: string;
  routeType: number;
  routeLevel: number;
  content: TContentBlock[];
  audio: TAudio;
  status: Statuses;
  points: any[];
  polyline: [string, string][];
  days: number;
  duration: string;
  externalUrl: string;
}

type TProps = {
  initialValues: IFormValues;
  onFinish: (values: ITouristRoutesItem) => void;
  onSaveDraft: (values: ITouristRoutesDraftItem) => void;
  cancelButtonHandler: () => void;
  isDraft: boolean;
};

const collapseFieldsErrors = {
  content: 'description',
  routeType: 'description',
  routeLevel: 'description',
  days: 'routeDuration',
  time: 'routeDuration',
};

export const TouristRoutesForm: React.FC<TProps> = ({
  initialValues,
  onFinish,
  onSaveDraft,
  cancelButtonHandler,
  isDraft,
}) => {
  const [activeCollpaseTabs, setActiveCollpaseTabs] = React.useState([
    'description',
    'points',
    'seo',
    'status',
    'polyline',
    'routeDuration',
    'link',
    'externalUrl',
  ]);
  const resolver = yupResolver(validationSchema);

  const methods = useForm({
    defaultValues: initialValues,
    resolver,
  });

  const handleSaveAsDraft = () => {
    const formValues = mapValuesToDraft(methods.getValues());
    onSaveDraft(formValues);
  };

  const submit = values => {
    const preparedValues = mapValues(values);

    onFinish(preparedValues);
  };

  useDeepEffect(() => {
    methods.reset(initialValues);
  }, [initialValues]);

  useDeepEffect(() => {
    if (!isEmpty(methods.formState.errors)) {
      const errorsKeys = Object.keys(methods.formState.errors).reduce(
        (acc, item) => {
          if (collapseFieldsErrors[item]) {
            acc.push(collapseFieldsErrors[item]);
          } else {
            acc.push(item);
          }
          return acc;
        },
        []
      );
      setActiveCollpaseTabs([
        ...Array.from(new Set([...activeCollpaseTabs, ...errorsKeys])),
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
            <Col flex='0 0 100px'>
              <MainImage name='image' label='Глав. фото' required />
            </Col>
            <Col flex={1}>
              <InputField
                name='name'
                label='Название маршрута'
                required
                placeholder='Введите название'
                showCount
                maxLength={255}
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <CatalogAsyncSelect
                name='tags'
                label='Tеги'
                placeholder='Выберите теги'
                requestParams={{
                  entityType: 'routes',
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
                placeholder='Описание'
                showCount
                maxLength={150}
              />
            </Col>
          </Row>
        </Card>
        <Collapse
          bordered={false}
          expandIconPosition='end'
          onChange={(value: string[]) => setActiveCollpaseTabs(value)}
          activeKey={activeCollpaseTabs}
        >
          <Collapse.Panel header='Описание маршрута' key='description'>
            <Row gutter={[24, 0]} align='bottom'>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <CatalogAsyncSelect
                  name='routeType'
                  label='Тип маршрута'
                  placeholder='Выберите тип маршрута'
                  requestParams={{
                    entityType: 'routes',
                    fieldType: 'routeTypes',
                  }}
                  required
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <CatalogAsyncSelect
                  name='routeLevel'
                  label='Сложность'
                  placeholder='Не указана'
                  requestParams={{
                    entityType: 'routes',
                    fieldType: 'routeLevels',
                  }}
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <UploadAudio name='audio' label='' />
              </Col>
            </Row>
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
          <Collapse.Panel
            header='Точки маршрута'
            key='points'
            className='ant-touristRoutes-collapse'
          >
            <TouristRoutePoints name='points' />
          </Collapse.Panel>
          <Collapse.Panel header='Траектория' key='polyline'>
            <CreateRouteMap name='polyline' />
          </Collapse.Panel>
          <Collapse.Panel
            header='Продолжительность маршрута'
            key='routeDuration'
          >
            <Row gutter={[48, 0]}>
              <Col md={{ span: 8 }} xs={{ span: 24 }}>
                <InputField
                  name='days'
                  label='Количество дней'
                  placeholder='0'
                  type='days'
                  required
                />
              </Col>
              <Col md={{ span: 8 }} xs={{ span: 24 }}>
                <DurationField name='duration' label='Время' required />
              </Col>
            </Row>
          </Collapse.Panel>
          <Collapse.Panel header='Туроператор' key='externalUrl'>
            <Row>
              <Col span={24}>
                <InputField
                  name='externalUrl'
                  label='Ссылка на туроператора'
                  addonBefore={<GlobalOutlined />}
                  placeholder={'Укажите ссылку'}
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
