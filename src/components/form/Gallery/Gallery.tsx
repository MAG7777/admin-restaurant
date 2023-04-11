import React from 'react';
import { FormItemProps, InputProps, notification } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import { capitalize } from 'utils/string';
import { pluralize } from 'utils/pluralize';

import { EditableGallery } from './EditableGallery';

type TProps = FormItemProps & InputProps;

export const Gallery: React.FC<TProps> = props => {
  const { control } = useFormContext();
  const notifyDuplicates = duplicateCount => {
    notification.warning({
      message: [
        capitalize(pluralize('отфильтрован', duplicateCount)),
        duplicateCount,
        pluralize('дубликат', duplicateCount),
      ].join(' '),
    });
  };
  return (
    <Controller
      name={props.name}
      render={({ field, fieldState }) => {
        return (
          <EditableGallery
            {...props}
            {...field}
            innerRef={field.ref}
            errors={fieldState.error}
            onChange={items => field.onChange(wrapFiles(items))}
            onReject={items => notifyDuplicates(items.length)}
          />
        );
      }}
      control={control}
    />
  );
};

function wrapFiles(items) {
  return items
    .map(item =>
      item instanceof window.Blob || item instanceof window.File
        ? { file: item }
        : item
    )
    .slice(0, 10);
}
