import React from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Col,
  Image,
  notification,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import {
  BankOutlined,
  EnvironmentOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { ViewContent } from 'components/view/ViewContent/ViewContent';
import { useAppDispatch, useAppSelector } from 'store';
import { MainLayout } from 'components/Layout/MainLayout';
import { getImageUrl } from 'utils/image';
import {
  loadAttractionItem,
  setPublishAttraction,
  setUnPublishAttraction,
} from 'store/slices/attractions/actions';
import { makeAddressString } from 'utils/entities';
import { omit } from 'utils/helpers';
import { WeekDays } from 'constants/weekdays';
import { contactIconsHash } from 'constants/contacts';
import {
  statusesColorsHash,
  StatusesEnum,
  statusesNamesHash,
} from 'constants/status';
import { ViewGallery } from 'components/view/ViewGallery';
import { ViewMap } from 'components/view/ViewMap';

export const View = () => {
  const { item } = useAppSelector(state => state.attractions);

  const dispatch = useAppDispatch();
  const { id } = useParams();

  const loadAttraction = () => {
    dispatch(loadAttractionItem(id));
  };

  React.useEffect(() => {
    loadAttraction();
  }, []);

  const handlePublish = async () => {
    await dispatch(setPublishAttraction(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно опубликована',
        });
        loadAttraction();
      });
  };

  const handleUnPublish = async () => {
    await dispatch(setUnPublishAttraction(id))
      .unwrap()
      .then(() => {
        notification.success({
          message: 'Cущность успешно снята с публикации',
        });
        loadAttraction();
      });
  };

  const getActions = () => {
    const buttons = [
      <Link key='edit' to={`/attractions/${id}/edit`}>
        <Button>Редактировать</Button>
      </Link>,
      <Button danger key='delete'>
        Удалить
      </Button>,
    ];
    if (item.status === StatusesEnum.PUBLISHED) {
      buttons.push(
        <Button key='unPublish' onClick={handleUnPublish}>
          Снять с публикации
        </Button>
      );
      buttons.push(<Button key='onSite'>Показать на сайте</Button>);
    }
    if (item.status === StatusesEnum.NOT_PUBLISHED) {
      buttons.push(
        <Button key='publish' onClick={handlePublish}>
          Опубликовать
        </Button>
      );
    }
    return buttons;
  };

  return (
    <MainLayout
      pageTitle='Просмотр'
      extraButtonsList={getActions()}
      aside={
        item.id && item.id === Number(id) ? (
          <div>
            <Content
              style={{
                height: '90px',
                paddingTop: '13px',
                paddingBottom: '18px',
              }}
            >
              <Row>
                <Typography.Text type='secondary'>Статус</Typography.Text>
              </Row>
              <Tag
                color={statusesColorsHash[item.status]}
                style={{ marginTop: '15px' }}
              >
                {statusesNamesHash[item.status]}
              </Tag>
            </Content>
            <Content style={{ marginTop: '24px' }}>
              <Row style={{ flexFlow: 'column nowrap' }}>
                <Typography.Title level={5} style={{ marginBottom: '17px' }}>
                  Контакты
                </Typography.Title>
                <Space direction='vertical' size='small'>
                  {item.contacts.map((contact, index) => {
                    return (
                      <Typography.Link
                        key={index}
                        href={contact.value}
                        target='_blank'
                      >
                        <span style={{ marginRight: '9px' }}>
                          {contactIconsHash[contact.type]}
                        </span>
                        {contact.value}
                      </Typography.Link>
                    );
                  })}
                </Space>
              </Row>
              <Row style={{ flexFlow: 'column nowrap', marginTop: '24px' }}>
                <Typography.Title level={5} style={{ marginBottom: '17px' }}>
                  Расписание места
                </Typography.Title>
                {Object.keys(omit(item.workTime, 'comment')).map(
                  (day, index) => {
                    if (item.workTime[day].from) {
                      return (
                        <Row key={index} justify='space-between'>
                          <div>{WeekDays[day]}</div>
                          <div>{`${dayjs
                            .utc(item.workTime[day].from)
                            .format('HH:mm')} - ${dayjs
                            .utc(item.workTime[day].to)
                            .format('HH:mm')}`}</div>
                        </Row>
                      );
                    } else {
                      return null;
                    }
                  }
                )}
                {item.workTime.comment && (
                  <Row style={{ marginTop: '16px' }}>
                    {item.workTime.comment}
                  </Row>
                )}
              </Row>
            </Content>
          </div>
        ) : null
      }
    >
      {item.id && item.id === Number(id) ? (
        <>
          {item.status === StatusesEnum.ON_MODERATION && (
            <Content
              style={{
                height: '90px',
                marginBottom: '24px',
                paddingTop: '13px',
                paddingBottom: '18px',
              }}
            >
              <Row
                justify='space-between'
                style={{ flexFlow: 'column nowrap', height: '100%' }}
              >
                <Row>
                  <Typography.Text type='secondary'>
                    Модерация контента
                  </Typography.Text>
                </Row>
                <Row>
                  <Space>
                    <Button danger>Отклонить</Button>
                    <Button type='primary' onClick={handlePublish}>
                      Опубликовать
                    </Button>
                  </Space>
                </Row>
              </Row>
            </Content>
          )}
          <Content>
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              <Row justify='space-between'>
                <Row align='middle'>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      marginRight: '10px',
                      borderRadius: '50%',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#BFBFBF',
                    }}
                  >
                    <BankOutlined style={{ fontSize: '24px' }} />
                  </div>
                  <Typography.Text style={{ color: '#BFBFBF' }}>
                    Достопримечательность
                  </Typography.Text>
                </Row>
                {item.categoryData && (
                  <Row align='middle'>
                    <Tag color='volcano'>{item.categoryData.name}</Tag>
                  </Row>
                )}
              </Row>
              <Row wrap={false}>
                <Col style={{ flexShrink: 0, marginRight: '32px' }}>
                  <Image
                    width={200}
                    height={200}
                    preview={false}
                    src={
                      item?.image
                        ? getImageUrl(item.image, 200, 200) ||
                          '/images/no-image.svg'
                        : '/images/no-image.svg'
                    }
                    fallback='/images/no-image.svg'
                    style={{ flexShrink: 0 }}
                  />
                </Col>
                <Col style={{ minWidth: 0 }}>
                  <Typography.Title level={4} style={{ marginBottom: '15px' }}>
                    {item.name}
                  </Typography.Title>
                  {item.shortDescription && (
                    <Typography.Text
                      style={{ fontSize: '12px', lineHeight: '20px' }}
                    >
                      {item.shortDescription}
                    </Typography.Text>
                  )}
                  {item.address && (
                    <Row align='middle' style={{ marginTop: '15px' }}>
                      <EnvironmentOutlined
                        style={{ marginRight: '10px', fontSize: '22px' }}
                      />
                      <Typography.Text
                        style={{ fontSize: '12px', lineHeight: '20px' }}
                      >
                        {makeAddressString(item.address)}
                      </Typography.Text>
                    </Row>
                  )}
                  {item.tagsData?.length > 0 && (
                    <Row align='middle' style={{ marginTop: '18px' }}>
                      <TagsOutlined
                        style={{ marginRight: '10px', fontSize: '22px' }}
                      />
                      {item.tagsData.map(tag => {
                        return <Tag key={tag.id}>{tag.name}</Tag>;
                      })}
                    </Row>
                  )}
                </Col>
              </Row>
              <Row>
                <ViewContent content={item.content} />
              </Row>
              {item.gallery?.length > 0 && (
                <Row>
                  <Typography.Title level={4}>Галерея</Typography.Title>
                  <ViewGallery gallery={item.gallery} />
                </Row>
              )}
              {item.address?.mapPosition && (
                <Row>
                  <ViewMap mapPosition={item.address.mapPosition} />
                </Row>
              )}
              {item.address?.comment && (
                <Row>
                  <Typography.Text>{item.address.comment}</Typography.Text>
                </Row>
              )}
            </Space>
          </Content>
        </>
      ) : null}
    </MainLayout>
  );
};
