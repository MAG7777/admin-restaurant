import React from 'react';
import { Form, Select } from 'antd';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { DefaultOptionType } from 'antd/lib/select';

import { debounce, isEmpty, isNumber, isObject, isString } from 'utils/helpers';
import { useDeepDidMountEffect } from 'utils/useDeepDidMountEffect';

interface IExtendedOptionType extends DefaultOptionType {
  extraData: any;
}

export type TAsyncSelectProps = {
  debounceTimeout?: number;
  fetchOptions: (searchQuery?: string) => any;
  fetchInitialValue: (id: string | number) => any;
  refetchKey?: string | number;
  name: string;
  label: string;
  defaultValue?: any;
  idField?: string;
  nameField?: string;
  noStyle?: boolean;
  mode?: 'multiple' | 'tags';
  required?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export const AsyncSelect: React.FC<TAsyncSelectProps> = ({
  debounceTimeout = 800,
  fetchOptions,
  fetchInitialValue,
  refetchKey,
  name,
  label,
  defaultValue,
  idField = 'id',
  nameField = 'name',
  noStyle,
  ...props
}) => {
  /**
   original code: https://ant.design/components/select/#components-select-demo-select-users
   **/
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const { control, setValue } = useFormContext();
  const value = useWatch({ name, control });

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = searchQuery => {
      setFetching(true);
      fetchOptions(searchQuery).then(newOptions => {
        setSelectOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  const setSelectOptions = newOptions => {
    let diffOptions = [];
    if (props.mode === 'multiple') {
      const optionsIds = newOptions.map(item => item._id);
      if (value && Array.isArray(value) && isObject(value[0])) {
        diffOptions = [...value].filter(
          item => !optionsIds.includes(item.value)
        );
      }
    }
    setOptions([
      ...newOptions,
      ...diffOptions.map(item => {
        const newItem = { ...item };
        newItem.hidden = true;
        return newItem;
      }),
    ]);
  };

  React.useEffect(() => {
    if (Array.isArray(value) && isObject(value[0])) {
      setOptions(value);
    } else if (!Array.isArray(value) && isObject(value)) {
      setOptions([value]);
    }
    if (value && (isString(value) || isNumber(value))) {
      if (props.mode === 'multiple') {
        fetchInitialValue(value).then(res => {
          setValue(
            name,
            res.map(item => ({
              ...item,
              key: item[idField],
              value: item[idField],
              label: item[nameField],
            }))
          );
          return;
        });
      } else {
        fetchInitialValue(value).then(res => {
          setValue(name, {
            ...res,
            key: res[idField],
            value: res[idField],
            label: res[nameField],
          });
          return;
        });
      }
    }
    if (!isFormattedValue(value)) {
      setInitalValue(value);
    }
  }, []);

  useDeepDidMountEffect(() => {
    fetchOptions().then(res => {
      setSelectOptions(res);
    });
  }, [refetchKey]);

  const isFormattedValue = value => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return true;
    }
    if (Array.isArray(value) && isObject(value[0]) && !isEmpty(value[0])) {
      if (value[0].key && value[0].value && value[0].label) {
        return true;
      }
      return false;
    } else if (isObject(value) && !isEmpty(value)) {
      if (value.key && value.value && value.label) {
        return true;
      }
      return false;
    }
    return false;
  };

  const setInitalValue = value => {
    if (Array.isArray(value) && isObject(value[0]) && isEmpty(value[0])) {
      setValue(
        name,
        value.map(item => ({
          ...item,
          key: item[idField],
          value: item[idField],
          label: item[nameField],
        }))
      );
    } else if (isObject(value) && isEmpty(value)) {
      setValue(name, {
        ...value,
        key: value[idField],
        value: value[idField],
        label: value[nameField],
      });
    }
    return null;
  };

  const onDropdownVisibleChange = isOpen => {
    if (isOpen) {
      fetchOptions().then(newOptions => {
        setSelectOptions(newOptions);
        setFetching(false);
      });
    }
  };

  return isFormattedValue(value) ? (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          help={fieldState.error?.message}
          validateStatus={fieldState.error ? 'error' : 'success'}
          required={props.required}
          noStyle={noStyle}
        >
          <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            showSearch={true}
            loading={fetching}
            onDropdownVisibleChange={onDropdownVisibleChange}
            {...field}
            {...props}
            onChange={(value, option: IExtendedOptionType) => {
              if (!value) {
                field.onChange(null);
                return;
              }
              if (props.mode === 'multiple') {
                field.onChange(
                  option.map(item => {
                    const { extraData, ...rest } = item;
                    return { ...rest, ...item.extraData };
                  })
                );
              } else {
                const { extraData, ...rest } = option;
                field.onChange({
                  ...rest,
                  ...(option?.extraData && { ...option.extraData }),
                });
              }
            }}
            virtual={false}
          >
            {options?.map(item => (
              <Select.Option
                hidden={Boolean(item.hidden)}
                key={item[idField]}
                extraData={item}
                label={item[nameField]}
                value={item[idField]}
              >
                {item[nameField]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
      control={control}
    />
  ) : null;
};
