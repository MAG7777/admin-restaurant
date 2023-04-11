import React from 'react';
import { Col, Row } from 'antd';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { ContactInput } from './ContactInput';
import {
  ContactsSelector,
  DefaultContactOptionsTypes,
} from './ContactsSelector';

interface IContactsProps {
  name: string;
}

export type THandleChangeOptionType = {
  value: string;
  type: DefaultContactOptionsTypes;
  id: string;
};

export const Contacts: React.FC<IContactsProps> = ({ name }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: name,
    control,
  });

  const handleSelectorChange = (option: THandleChangeOptionType) => {
    append({ type: option.type, value: '' });
  };

  return (
    <Row gutter={[24, 0]}>
      {fields.length ? (
        <>
          {fields.map((item: any, index) => (
            <Controller
              key={item.id}
              name={`contacts.${index}.value`}
              control={control}
              defaultValue={item.value}
              render={({ field, fieldState }) => (
                <ContactInput
                  type={item.type}
                  error={fieldState.error}
                  handleClear={() => remove(index)}
                  {...field}
                />
              )}
            />
          ))}
        </>
      ) : null}
      <Col span={24}>
        <ContactsSelector
          selectedInputs={fields}
          handleSelectorChange={handleSelectorChange}
        />
      </Col>
    </Row>
  );
};
