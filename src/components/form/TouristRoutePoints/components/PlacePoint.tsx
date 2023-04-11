import { Col, Image, Row, Typography } from 'antd';
import React from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useFormContext, useWatch } from 'react-hook-form';

import { Select } from 'components/form/base/Select';
import { PlaceTypes } from 'constants/places';
import { PlaceAsyncSelect } from 'components/form/selects/PlaceAsyncSelect';
import { getImageUrl } from 'utils/image';
import { makeAddressString } from 'utils/entities';
import { UploadAudio } from 'components/form/UploadAudio/UploadAudio';
import { Content } from 'components/form/Content/Content';
import { isObject, isString } from 'utils/helpers';
import { DurationField } from 'components/form/DurationField/DurationField';
import { StatusesEnum } from 'constants/status';

export const PlacePoint = ({ name, value }) => {
  const { control } = useFormContext();
  const placeType = useWatch({ name: `${name}.placeType`, control });

  const getPlaceType = () => {
    if (!placeType || isString(placeType)) {
      return placeType;
    }
    if (isObject(placeType)) {
      return placeType.value;
    }
    return null;
  };
  return (
    <>
      <Select
        name={`${name}.placeType`}
        label='Категория места'
        required
        options={[
          ...Object.keys(PlaceTypes).map(item => {
            return {
              value: item,
              label: PlaceTypes[item],
            };
          }),
        ]}
      />
      <PlaceAsyncSelect
        name={`${name}.place`}
        label='Название места'
        placeType={getPlaceType() || 'attractions'}
        disabled={!getPlaceType()}
        required
        requestParams={{ status: StatusesEnum.PUBLISHED }}
      />
      {value.place?.id && (
        <Row
          style={{
            marginBottom: '24px',
            padding: '7px 16px',
            border: '1px solid #d9d9d9',
            backgroundColor: '#fff',
          }}
          wrap={false}
        >
          <div style={{ flexShrink: 0 }}>
            <Image
              width={100}
              height={100}
              preview={false}
              src={
                value.place?.image
                  ? getImageUrl(value.place.image, 100, 100) ||
                    '/images/no-image.svg'
                  : '/images/no-image.svg'
              }
              fallback='/images/no-image.svg'
            />
          </div>
          <div
            style={{
              marginLeft: '16px',
              display: 'flex',
              flexFlow: 'column nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Typography.Text>{value.place.name}</Typography.Text>
            <Typography.Text
              style={{ marginTop: '7px', fontSize: '12px', lineHeight: '20px' }}
            >
              {value.place.shortDescription}
            </Typography.Text>
            {value.place.address?.region && (
              <div
                style={{
                  marginTop: 'auto',
                  fontSize: '12px',
                  lineHeight: '20px',
                }}
              >
                <EnvironmentOutlined
                  style={{ marginRight: '5px', fontSize: '14px' }}
                />
                {makeAddressString(value.place.address)}
              </div>
            )}
          </div>
        </Row>
      )}
      <Row gutter={[24, 0]} align='bottom'>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <DurationField
            name={`${name}.duration`}
            label='Длительность остановки'
          />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <UploadAudio name={`${name}.audio`} />
        </Col>
      </Row>
      <Content
        name={`${name}.description`}
        label='Описание'
        placeholder='Начните печатать текст'
        withWidgetsDescription
        withPreparingForModeration
        required
        enabledTypes={[]}
      />
    </>
  );
};
