import React from 'react';
import { useFormContext } from 'react-hook-form';

import { entityTypeNames } from 'constants/catalog';
import { useAppDispatch, useAppSelector } from 'store';
import { loadCatalogEntityTypes } from 'store/slices/catalogEntityTypes/actions';
import { isEmpty, isObject } from 'utils/helpers';
import { useDeepEffect } from 'utils/useDeepEffect';

import { ISelectFieldProps, Select } from '../base/Select';

interface IProps extends ISelectFieldProps {
  withEmptyValue?: boolean;
}
export const CatalogEntityTypesSelect: React.FC<IProps> = ({
  label = 'Тип сущности',
  withEmptyValue = false,
  ...props
}) => {
  const { data } = useAppSelector(state => state.catalogEntityTypes);
  const dispatch = useAppDispatch();
  const { getValues, setValue } = useFormContext();

  const options = React.useMemo(() => {
    return Object.keys(data).map(key => ({
      value: key,
      label: entityTypeNames[key],
    }));
  }, [Object.keys(data).length]);

  React.useEffect(() => {
    if (isEmpty(data)) {
      dispatch(loadCatalogEntityTypes());
    }
  }, []);

  useDeepEffect(() => {
    const value = getValues(props.name);
    if (value && !isObject(value)) {
      setValue(props.name, {
        value: value,
        label: entityTypeNames[value],
      });
    }
  }, [data]);

  return (
    <>
      <Select
        label={label}
        options={[
          ...(withEmptyValue ? [{ value: '', label: 'Все' }] : []),
          ...options,
        ]}
        {...props}
      />
    </>
  );
};
