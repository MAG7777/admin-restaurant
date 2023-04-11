import React from 'react';
import { Checkbox, Col, Row, Typography } from 'antd';
import { useFormContext, useWatch } from 'react-hook-form';

import { getValueByStringKeyWithArr } from 'utils/objects';
import { WeekDays, WeekDaysKeys } from 'constants/weekdays';

import { TimePickerField } from '../base/TimePickerField';
import { TextAreaField } from '../base/TextAreaField';
import styles from './Schedule.module.less';

interface IScheduleProps {
  name: string;
  withoutComment?: boolean;
  withAllTimeButton?: boolean;
}

const weekDays = [
  ...Object.keys(WeekDays).map(key => {
    return {
      label: WeekDays[key as WeekDaysKeys],
      value: key,
    };
  }),
];

export const Schedule: React.FC<IScheduleProps> = ({
  name,
  withoutComment,
  withAllTimeButton,
}) => {
  const { formState, setValue, control } = useFormContext();

  return (
    <div>
      <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '16px' }}>
        {weekDays.map((item, index) => {
          const value = useWatch({ name: `${name}.${item.value}`, control });
          return (
            <Row key={item.value}>
              <Row key={index} align='middle' style={{ gap: '14px' }}>
                <div className={styles.label}>{item.label}</div>
                с
                <TimePickerField
                  name={`${name}.${item.value}.from`}
                  width={100}
                  suffixIcon={null}
                  minuteStep={5}
                  disabled={withAllTimeButton ? value.fullDay : false}
                />
                до
                <TimePickerField
                  name={`${name}.${item.value}.to`}
                  width={100}
                  suffixIcon={null}
                  minuteStep={5}
                  disabled={withAllTimeButton ? value.fullDay : false}
                />
                <div style={{ minWidth: 0 }}>
                  <div>
                    <Typography.Text type='danger'>
                      {
                        getValueByStringKeyWithArr(
                          formState.errors,
                          `${name}.${item.value}.from`
                        )?.message
                      }
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type='danger'>
                      {
                        getValueByStringKeyWithArr(
                          formState.errors,
                          `${name}.${item.value}.to`
                        )?.message
                      }
                    </Typography.Text>
                  </div>
                </div>
              </Row>
              {withAllTimeButton && (
                <Row align='middle' style={{ marginLeft: 10 }}>
                  <Col>
                    <Checkbox
                      checked={value.fullDay}
                      onChange={e =>
                        setValue(`${name}.${item.value}`, {
                          from: null,
                          to: null,
                          fullDay: e.target.checked,
                        })
                      }
                    >
                      Круглосуточно
                    </Checkbox>
                  </Col>
                </Row>
              )}
            </Row>
          );
        })}
      </div>
      {!withoutComment && (
        <TextAreaField
          label=''
          placeholder='Комментарий'
          name={`${name}.comment`}
          showCount
          maxLength={255}
          style={{ marginTop: '24px' }}
          rows={3}
        />
      )}
    </div>
  );
};
