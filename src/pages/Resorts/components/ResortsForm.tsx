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
import { LocationSelector } from 'components/form/AddressSelector/LocationSelector';
import { Schedule } from 'components/form/Schedule/Schedule';
import { Status } from 'components/form/Status/Status';
import { Gallery } from 'components/form/Gallery/Gallery';
import { IAttractionAddress } from 'types/address';
import { TImage } from 'types/image';
import { Contacts } from 'components/form/Contacts';
import { TContact } from 'types/contact';
import { CatalogAsyncSelect } from 'components/form/selects/CatalogAsyncSelect';
import { TSchedule } from 'types/schedule';
import { FormActions } from 'components/Layout/FormActions/FormActions';
import { isEmpty } from 'utils/helpers';
import { Statuses } from 'constants/status';
import { IResortDraftItem, IResortItem } from 'store/slices/resorts/interfaces';

import { mapValues, mapValuesToDraft, validationSchema } from './formUtils';

interface IFormValues {
  name: string;
  category: number;
  tags: number[];
  image: TImage;
  content: TContentBlock[];
  gallery: TImage[];
  address: IAttractionAddress;
  workTime: TSchedule;
  contacts: TContact[];
  status: Statuses;
}

type TProps = {
  initialValues: IFormValues;
  onFinish: (values: IResortItem) => void;
  onSaveDraft: (values: IResortDraftItem) => void;
  cancelButtonHandler: () => void;
  isDraft: boolean;
};

export const ResortsForm: React.FC<TProps> = ({
  initialValues,
  onFinish,
  onSaveDraft,
  cancelButtonHandler,
  isDraft,
}) => {
  const [activeCollpaseTabs, setActiveCollpaseTabs] = React.useState([
    'content',
    'gallery',
    'address',
    'workTime',
    'contacts',
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
                label='Название места'
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
                  entityType: 'resorts',
                  fieldType: 'categories',
                }}
              />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <CatalogAsyncSelect
                name='tags'
                label='Tеги'
                placeholder='Выберите теги'
                requestParams={{
                  entityType: 'resorts',
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
                maxLength={255}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <InputField
                name='externalUrl'
                label='Ссылка на сайт с покупкой ски-пасса'
                addonBefore={<GlobalOutlined />}
                placeholder='Укажите ссылку'
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
          <Collapse.Panel header='Описание места' key='content'>
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
          <Collapse.Panel header='Галерея' key='gallery'>
            <Row>
              <Col span={24}>
                <Gallery name='gallery' />
              </Col>
            </Row>
          </Collapse.Panel>
          <Collapse.Panel header='Адрес' key='address'>
            <LocationSelector name='address' />
          </Collapse.Panel>
          <Collapse.Panel header='Режим работы' key='workTime'>
            <Schedule name='workTime' />
          </Collapse.Panel>
          <Collapse.Panel header='Контакты' key='contacts'>
            <Contacts name='contacts' />
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
