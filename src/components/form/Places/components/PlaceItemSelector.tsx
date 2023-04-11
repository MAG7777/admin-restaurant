import React from 'react';
import { Col, Image, Row, Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useFormContext, useWatch } from 'react-hook-form';

import { PlaceTypes, PlaceTypesKeys } from 'constants/places';
import { isObject, isString } from 'utils/helpers';
import { getImageUrl } from 'utils/image';
import { makeAddressString } from 'utils/entities';
import { PlaceAsyncSelect } from 'components/form/selects/PlaceAsyncSelect';
import { Select } from 'components/form/base/Select';
import { StatusesEnum } from 'constants/status';

export const PlaceItemSelector: React.FC<{ name: string }> = ({ name }) => {
  const { control } = useFormContext();
  const value = useWatch({ name, control });

  const getPlaceType = () => {
    const { placeType } = value;
    if (!placeType || isString(placeType)) {
      return placeType;
    }
    if (isObject(placeType)) {
      return placeType.value;
    }
    return null;
  };

  return (
    <Row style={{ width: '100%' }}>
      <Col span={24}>
        <Select
          name={`${name}.placeType`}
          label='Категория места'
          required
          placeholder='Выберите категорию'
          options={[
            ...Object.keys(PlaceTypes).map(item => ({
              value: item,
              label: PlaceTypes[item as PlaceTypesKeys],
            })),
          ]}
        />
      </Col>
      <Col span={24}>
        <PlaceAsyncSelect
          name={`${name}.place`}
          label='Название места'
          placeholder='Введите название'
          placeType={getPlaceType() || 'attractions'}
          disabled={!getPlaceType()}
          showArrow={false}
          required
          requestParams={{ status: StatusesEnum.PUBLISHED }}
        />
      </Col>

      {value.place?.id && (
        <Row style={{ width: '100%', marginBottom: 24 }} wrap={false}>
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
            <Typography.Paragraph
              style={{ fontSize: 14, marginBottom: 8 }}
              ellipsis={{ rows: 2 }}
            >
              {value.place.name}
            </Typography.Paragraph>

            <Typography.Paragraph
              style={{ fontSize: 12 }}
              ellipsis={{ rows: 2 }}
            >
              {value.place.shortDescription}
            </Typography.Paragraph>

            {value.place.address?.region && (
              <Typography.Paragraph style={{ fontSize: 12 }}>
                <EnvironmentOutlined style={{ marginRight: 5, fontSize: 12 }} />
                {makeAddressString(value.place.address)}
              </Typography.Paragraph>
            )}
          </div>
        </Row>
      )}
    </Row>
  );
};
