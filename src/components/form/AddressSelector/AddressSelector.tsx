import React from 'react';
import { Button, Col } from 'antd';
import { useFormContext, useWatch } from 'react-hook-form';

import { AddressType, IAddress, IAttractionAddress } from 'types/address';
import { useDeepEffect } from 'utils/useDeepEffect';

import { AddressAutocomplete } from './AddressAutocomplete';
import { CatalogRegionSelect } from '../selects/CatalogRegionSelect';

type TDefaultInputConfig = {
  disabled?: boolean;
  display?: boolean;
  label: string;
  required?: boolean;
  key?: keyof IAddress | Array<keyof IAddress>;
  manual?: boolean;
  size?: number;
};

type TDefaultPartsType = Record<string, TDefaultInputConfig>;

interface IAddressSelector {
  errors: any;
  value: IAttractionAddress;
  onChange: (obj: IAttractionAddress) => void;
  search: () => void;
  isSearching: boolean;
  name: string;
}

const defaultParts: TDefaultPartsType = {
  area: {
    display: true,
    label: 'Район',
    key: AddressType.Region,
  },
  'city/settlement': {
    display: true,
    label: 'Город/населённый пункт',
    required: true,
    key: AddressType.Area,
  },
  street: {
    display: true,
    label: 'Улица',
    key: [AddressType.City, AddressType.Settlement],
  },
  house: {
    display: true,
    label: 'Дом',
    key: AddressType.Street,
  },
  'city/house': {
    label: 'Адрес',
    required: true,
  },
  'area/house': {
    label: 'Адрес',
    required: true,
  },
};

export const AddressSelector: React.FC<IAddressSelector> = React.forwardRef(
  (
    { errors, onChange, search, isSearching, name },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const { control } = useFormContext();
    const value = useWatch({ name, control });
    const onAddressChange = (address: IAttractionAddress) => {
      onChange({
        ...address,
        comment: value.comment || '',
        region: value.region,
      });
    };

    useDeepEffect(() => {
      if (value.region && !value.region.fiasId) {
        onChange({
          comment: value.comment || '',
          region: {
            name: value.region.children,
            fiasId: value.region.value,
            type: 'region',
            ...value.region,
          },
        });
      }
    }, [value.region]);

    const fields = Object.keys(defaultParts).map((partLevel, index) => {
      const [level, sublevel] = partLevel.split('/');
      const { display, label, manual, required, key } = {
        ...defaultParts[partLevel],
      };

      // clear autocomplete inner data on linked field change
      let fiasIdKey = level;
      if (key) {
        fiasIdKey = !Array.isArray(key)
          ? value[key]?.fiasId || ''
          : key.reduce(
              (acc, item: keyof IAddress) => value[item]?.fiasId || acc,
              ''
            );
      }

      return display ? (
        <AddressAutocomplete
          key={`${fiasIdKey}.${index}`}
          label={label}
          disableManual={!manual}
          disabled={!value.region}
          errors={errors}
          id={level}
          level={level as keyof IAddress}
          name={level}
          onChange={onAddressChange}
          placeholder={label}
          sublevel={sublevel}
          value={value}
          required={required}
        />
      ) : null;
    });

    fields.push(
      <Button
        onClick={search}
        loading={isSearching}
        style={{ marginBottom: 24 }}
      >
        Найти на карте
      </Button>
    );

    return (
      <Col lg={{ span: 20 }} xs={{ span: 24 }}>
        <Col>
          <div style={{ position: 'relative' }} ref={ref} tabIndex={0}>
            <CatalogRegionSelect
              name={`${name}.region`}
              label='Регион'
              showArrow={false}
              placeholder='Регион'
              required
              onClear={() => {
                onChange({
                  comment: value.comment,
                });
              }}
            />
          </div>
        </Col>

        {fields.map((item, index) => (
          <Col key={index}>{item}</Col>
        ))}
      </Col>
    );
  }
);

AddressSelector.displayName = 'AddressSelector';
