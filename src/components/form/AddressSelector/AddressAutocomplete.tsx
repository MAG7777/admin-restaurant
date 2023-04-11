import React from 'react';
import { Form, notification, Select } from 'antd';
import { BaseOptionType } from 'rc-select/lib/Select';
import { useFormContext } from 'react-hook-form';

import {
  getLowerAddressLevels,
  getUpperAddressLevels,
  makeAddressString,
} from 'utils/entities';
import { getValueByStringKeyWithArr } from 'utils/objects';
import { getaddresses } from 'utils/dadata';
import { debounce, isObject, omit } from 'utils/helpers';
import { AddressType, IAddress, IAttractionAddress } from 'types/address';

interface IAddressAutocompleteProps {
  debounceTimeout?: number;
  name: string;
  errors: any;
  value: IAttractionAddress;
  level: keyof IAddress;
  label: string;
  disableManual: boolean;
  disabled?: boolean;
  id: string;
  onChange: (address: IAttractionAddress) => void;
  placeholder: string;
  sublevel?: string;
  required?: boolean;
}

type TOptionItem = {
  address: IAttractionAddress;
  key?: string;
  label: string | JSX.Element;
  nameQuery: string;
  value?: string;
};

type TNewOptionItem = {
  address: IAttractionAddress;
  key: string;
  isNew: boolean;
  label: JSX.Element;
  nameQuery: string;
  value?: string;
  _id: string;
};

type TOptions = TOptionItem | TNewOptionItem;

const NEW_ITEM_ID = 'new_item_id';

export const AddressAutocomplete: React.FC<IAddressAutocompleteProps> = ({
  debounceTimeout = 800,
  name,
  errors,
  disableManual,
  ...props
}) => {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<TOptions[]>([]);

  const loadOptions = (value: string) => {
    setOptions([]);
    setFetching(true);

    fetchOptions(value).then(newOptions => {
      setOptions(newOptions);
      setFetching(false);
    });
  };

  const debounceFetcher = debounce(loadOptions, debounceTimeout);

  React.useEffect(() => {
    const levels = getLevels();
    const value = props.value;
    if (isObject(value) && value[props.level]) {
      setOptions([
        {
          address: {},
          nameQuery: '',
          key: value[props.level]?.fiasId,
          value: value[props.level]?.fiasId,
          label: makeAddressString(value, { levels }),
        },
      ]);
    } else {
      fetchOptions().then(res => {
        setOptions(res);
      });
    }
  }, []);

  const getManualAddressLocale = ({ nameQuery }: { nameQuery: string }) => {
    const { level } = props;
    const location = nameQuery.split(',')[0];

    const params = {
      nameQuery: location,
      restriction: getAddressRestriction(),
      type: level,
    };
    return getaddresses(params).then(addresses => addresses[0]);
  };

  const onChange = (value: TOptions) => {
    const { level } = props;
    const outdatedLevels = [level, ...getLowerAddressLevels(level)];
    const manualValueFieldValue = (value: TOptions) => ({
      ...omit(props.value, outdatedLevels),
      ...(value && value.address),
    });

    if (!value) {
      return;
    } else if (value && 'isNew' in value && value.isNew) {
      getManualAddressLocale(value).finally(() => {
        props.onChange({
          ...manualValueFieldValue(value),
        });
      });
    } else {
      if (value.address) {
        props.onChange(value.address);
      }
    }
  };

  const getAddressRestriction = () => {
    const { level } = props;
    let address = props.value;

    const isRegion =
      address.region &&
      address.region.fiasId &&
      address.city &&
      address.city.fiasId &&
      address.region.fiasId === address.city.fiasId;

    if (isRegion) {
      address = omit(address, 'city');
    }

    const restrictionLevel: AddressType = getUpperAddressLevels(level)
      .reverse()
      .find((item: AddressType) => address[item] && address[item]?.fiasId);

    if (restrictionLevel) {
      return {
        level: restrictionLevel || '',
        _id: address[restrictionLevel]?.fiasId || '',
      };
    }
  };

  const getLevels = (): AddressType[] => {
    const { level, sublevel } = props;
    const lowerLevels = [level, ...getLowerAddressLevels(level)];
    return sublevel
      ? [lowerLevels, [...getUpperAddressLevels(sublevel), sublevel]].reduce(
          (a, b) => a.filter(c => b.includes(c))
        )
      : [level];
  };

  const getItem = (address: IAttractionAddress) => {
    const levels = getLevels();
    const lastIndex = levels.reverse().find(level => address[level]);

    if (!lastIndex) return;

    const levelData = address[lastIndex];

    if (!levelData) return;

    return {
      key: levelData.fiasId,
      value: levelData.fiasId,
      label: makeAddressString(address, { levels, exclude: [] }),
      address,
    };
  };

  const fetchOptions = async (nameQuery?: string): Promise<TOptions[] | []> => {
    const { level } = props;

    const params = {
      nameQuery,
      restriction: getAddressRestriction(),
      type: level,
    };

    const addresses = await getaddresses(params);

    if (nameQuery && !addresses.length) {
      notification.error({
        message: 'Адрес не найден в ФИАС, введите другой адрес',
      });
    }

    let items: any[] =
      addresses?.map(address => ({
        ...getItem(address),
        nameQuery: params.nameQuery || '',
      })) || [];

    if (!disableManual && params.nameQuery) {
      const newItem: TNewOptionItem = {
        _id: NEW_ITEM_ID,
        key: params.nameQuery,
        label: (
          <span>
            Добавить <b>{params.nameQuery}</b>...
          </span>
        ),
        value: params.nameQuery,
        address: { [level]: { name: params.nameQuery } },
        nameQuery: params.nameQuery,
        isNew: true,
      };
      items = [newItem, ...items];
    }

    return items;
  };

  const item = getItem(props.value);

  return (
    <Form.Item
      help={getValueByStringKeyWithArr(errors, name)?.message}
      validateStatus={
        getValueByStringKeyWithArr(errors, name) ? 'error' : 'success'
      }
      label={props.label}
      required={props.required}
    >
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        showSearch={true}
        loading={fetching}
        {...props}
        value={item}
        onChange={(value, option: BaseOptionType) => {
          onChange({
            ...option,
            ...(option?.extraData && { ...option.extraData }),
          });
        }}
        notFoundContent={null}
        showArrow={false}
        onSelect={() => setOptions([])}
      >
        {options?.map((item, index) => {
          return (
            <Select.Option
              key={`${item.key}.${index}`}
              extraData={item}
              label={item.label}
              value={item.key}
            >
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
};
