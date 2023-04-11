import { Dayjs } from 'dayjs';
import * as React from 'react';
import { PickerTimeProps } from 'antd/es/date-picker/generatePicker';

import { AntDatePicker } from './AntDatePicker';

export type TimePickerProps = Omit<PickerTimeProps<Dayjs>, 'picker'>;

export const AntTimePicker = React.forwardRef<any, TimePickerProps>(
  (props, ref) => {
    return (
      <AntDatePicker {...props} picker='time' mode={undefined} ref={ref} />
    );
  }
);

AntTimePicker.displayName = 'TimePicker';

export type AntTimePickerProps = React.ComponentProps<typeof AntTimePicker>;
