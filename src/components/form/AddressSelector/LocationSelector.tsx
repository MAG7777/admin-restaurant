import React from 'react';
import SpinFC from 'antd/lib/spin';
import { Form, notification, Row, Col } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import { AnyObject, YMapsApi } from 'react-yandex-maps';

import { makeAddressString } from 'utils/entities';

import { AddressSelector } from './AddressSelector';
import { FormMap } from '../FormMap/FormMap';
import { InputField } from '../base/InputField';

type LocationSelectorProps = {
  name: string;
  mapPositionName?: string;
};

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  name,
  mapPositionName = 'mapPosition',
}: LocationSelectorProps) => {
  const [isSearching, setIsSearching] = React.useState(false);
  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);

  const { control, setValue, getValues } = useFormContext();

  const onMapPositionChange = (coordinates: number[]) => {
    const coordinatesToString = coordinates.map(String);
    setValue(`${name}.${mapPositionName}`, [...coordinatesToString], {
      shouldValidate: true,
    });
  };

  const onMapLoad = (map: YMapsApi) => {
    setYmaps(map);
  };

  const search = () => {
    const address = getValues(`${name}`);

    if (address && ymaps) {
      setIsSearching(true);
      ymaps
        .geocode(['Россия', makeAddressString(address)].join(', '), {
          results: 1,
          json: true,
        })
        .then((result: AnyObject) => {
          const coordinates =
            result?.GeoObjectCollection?.metaDataProperty
              ?.GeocoderResponseMetaData?.Point?.coordinates;
          setIsSearching(false);
          if (coordinates) {
            onMapPositionChange(coordinates.reverse());
          } else {
            notification.error({
              message: 'Адрес не найден',
            });
          }
        })
        .catch((err: unknown) => {
          notification.error({
            message: 'Ошибка при поиске адреса',
          });
        });
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <Row>
            <Col lg={{ span: 10 }} xs={{ span: 24 }} flex={1}>
              <AddressSelector
                errors={fieldState.error}
                search={search}
                isSearching={isSearching}
                {...field}
              />
            </Col>

            <Col
              lg={{ span: 14 }}
              xs={{ span: 24 }}
              style={{
                position: 'relative',
                minHeight: '200px',
                display: 'block',
              }}
            >
              {isSearching && (
                <div
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 40,
                    zIndex: 1,
                  }}
                >
                  <SpinFC />
                </div>
              )}

              <Form.Item
                help={fieldState.error?.[mapPositionName]?.message}
                validateStatus={
                  fieldState.error?.[mapPositionName] ? 'error' : 'success'
                }
              >
                <FormMap
                  {...field}
                  onChange={onMapPositionChange}
                  onMapLoad={onMapLoad}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24} flex={1} style={{ marginBottom: '-24px' }}>
              <InputField
                name={`${name}.comment`}
                label='Комментарий к адресу'
                showCount
                maxLength={255}
                placeholder='Комментарий к адресу'
              />
            </Col>
          </Row>
        </>
      )}
    />
  );
};
