import React from 'react';
import { Button, Col, Collapse, Row, Card, Radio } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { TContentBlock } from 'components/form/Content/contentTypes';
import { InputField } from 'components/form/base/InputField';
import { useDeepEffect } from 'utils/useDeepEffect';
import { MainImage } from 'components/form/MainImage/MainImage';
import { Content } from 'components/form/Content/Content';
import { Status } from 'components/form/Status/Status';
import { Gallery } from 'components/form/Gallery/Gallery';
import { TImage } from 'types/image';
import { CatalogAsyncSelect } from 'components/form/selects/CatalogAsyncSelect';
import { FormActions } from 'components/Layout/FormActions/FormActions';
import { isEmpty } from 'utils/helpers';
import { PriceRange } from 'components/form/PriceRange';
import { Places } from 'components/form/Places';
import { Statuses } from 'constants/status';
import {
  CatalogRegionSelect,
  TRegionType,
} from 'components/form/selects/CatalogRegionSelect';
import { DurationField } from 'components/form/DurationField/DurationField';
import { IEventsItem, TPlace } from 'store/slices/events/interfaces';

import { mapValues, mapValuesToDraft } from './formUtils';
import { validationSchema } from './formValidation';

interface IFormValues {
  name: string;
  image: TImage;
  category: number;
  tags: number[];
  region: TRegionType;
  shortDescription: string;
  gallery: TImage[];
  content: TContentBlock[];
  ageRestriction: string;
  places: TPlace[];
  price: {
    price: number;
    maxPrice: number;
    freePrice: boolean;
  };
  externalUrl: string;
  duration: string;
  status: Statuses;
}

type TProps = {
  initialValues: IFormValues;
  onFinish: (values: IEventsItem) => void;
  onSaveDraft?: (values: Omit<IEventsItem, 'status'>) => void;
  cancelButtonHandler: () => void;
  isDraft: boolean;
};

export const ageRestriction = ['0+', '6+', '12+', '16+', '18+'];

export const EventsForm: React.FC<TProps> = ({
  initialValues,
  onFinish,
  onSaveDraft,
  cancelButtonHandler,
  isDraft,
}) => {
  const [activeCollpaseTabs, setActiveCollpaseTabs] = React.useState([
    'content',
    'gallery',
    'ageRestriction',
    'places',
    'price',
    'externalUrl',
    'duration',
    'status',
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
            <Col flex={1} style={{ minWidth: 200 }}>
              <InputField
                name='name'
                label='Название события'
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
                name='category'
                label='Категория'
                placeholder='Выберите категорию'
                required
                requestParams={{
                  entityType: 'events',
                  fieldType: 'categories',
                }}
              />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 16 }}>
              <CatalogAsyncSelect
                name='tags'
                label='Tеги'
                placeholder='Выберите теги'
                requestParams={{
                  entityType: 'events',
                  fieldType: 'tags',
                }}
                mode='multiple'
              />
            </Col>
          </Row>
          <Col xs={{ span: 24 }} md={{ span: 10 }}>
            <CatalogRegionSelect
              name='region'
              label='Регион'
              placeholder='Выберите регион'
              required
            />
          </Col>
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
          <Collapse.Panel header='Галерея' key='gallery'>
            <Row>
              <Col span={24}>
                <Gallery name='gallery' />
              </Col>
            </Row>
          </Collapse.Panel>
          <Collapse.Panel header='Описание события' key='content'>
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
          <Collapse.Panel header='Возрастное ограничение' key='ageRestriction'>
            <Radio.Group
              defaultValue={initialValues.ageRestriction}
              onChange={e => methods.setValue('ageRestriction', e.target.value)}
            >
              {ageRestriction.map(item => (
                <Radio.Button
                  key={item}
                  value={item}
                  checked={item === initialValues.ageRestriction}
                  style={{ marginRight: 24 }}
                >
                  {item}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Collapse.Panel>
          <Collapse.Panel header='Место и время проведения' key='places'>
            <Places name='places' />
          </Collapse.Panel>
          <Collapse.Panel header='Стоимость' key='price'>
            <PriceRange name='price' />
          </Collapse.Panel>
          <Collapse.Panel header='Продажа на внешнем сайте' key='externalUrl'>
            <InputField
              name='externalUrl'
              label='Ссылка на продажу на стороннем сайте'
              placeholder='Ссылка на продажу на стороннем сайте'
              addonBefore={<GlobalOutlined />}
              formItemStyle={{ marginBottom: 0 }}
            />
          </Collapse.Panel>
          <Collapse.Panel header='Продолжительность события' key='duration'>
            <Col span={8}>
              <DurationField
                name='duration'
                label='Продолжительность события'
                suffixIcon={null}
                minuteStep={5}
              />
            </Col>
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
