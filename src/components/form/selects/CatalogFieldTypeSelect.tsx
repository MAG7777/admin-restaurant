import React from 'react';

import { fieldTypeNames } from 'constants/catalog';
import { useAppSelector } from 'store';
import { isEmpty } from 'utils/helpers';
import { useDeepEffect } from 'utils/useDeepEffect';

import { ISelectFieldProps, Select } from '../base/Select';

interface IProps extends ISelectFieldProps {
  entityType: string;
  withEmptyValue?: boolean;
}
export const CatalogFieldTypeSelect: React.FC<IProps> = ({
  label = 'Тип поля',
  entityType,
  withEmptyValue = false,
  ...props
}) => {
  const [options, setOptions] = React.useState([]);
  const { data } = useAppSelector(state => state.catalogEntityTypes);

  useDeepEffect(() => {
    if (isEmpty(data)) {
      return;
    }
    if (!entityType) {
      const allOptions = Object.keys(data).reduce((acc, key) => {
        return [...acc, ...data[key]];
      }, []);
      setOptions(
        [...new Set(allOptions)].map(type => {
          return {
            value: type,
            label: fieldTypeNames[type],
          };
        })
      );
    } else {
      setOptions(
        data[entityType].map(type => {
          return {
            value: type,
            label: fieldTypeNames[type],
          };
        })
      );
    }
  }, [Object.keys(data).length, entityType]);
  return (
    <Select
      label={label}
      options={[
        ...(withEmptyValue ? [{ value: '', label: 'Все' }] : []),
        ...options,
      ]}
      {...props}
    />
  );
};
