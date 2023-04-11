/* eslint-disable react/prop-types */
import React from 'react';
import { Typography, Form, Input } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import { Content } from 'antd/lib/layout/layout';

import { videoHostings as helpersVideoHostings } from 'utils/videoHostings';
import { getValueByStringKeyWithArr } from 'utils/objects';

const videoHostings = helpersVideoHostings.map(item => item.label).join(', ');

type TProps = {
  name: string;
  value: any;
  required?: boolean;
  noStyle?: boolean;
};

export const Video = React.forwardRef<HTMLDivElement>((props: TProps, ref) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='section' ref={ref}>
      <Content style={{ backgroundColor: '#FAFAFA' }}>
        <Form.Item
          label={
            <span>
              Ссылка на видео &nbsp;
              <Typography.Text type='secondary'>
                ({videoHostings})
              </Typography.Text>
            </span>
          }
          help={getValueByStringKeyWithArr(errors, props.name)?.message}
          validateStatus={
            getValueByStringKeyWithArr(errors, props.name) ? 'error' : 'success'
          }
          required={props.required}
          noStyle={props.noStyle}
        >
          <Controller
            name={props.name}
            render={({ field }) => (
              <Input
                placeholder='Ссылка на видео'
                {...field}
                {...props}
                autoComplete={'chrome-off'}
              />
            )}
            control={control}
          />
        </Form.Item>
      </Content>
    </div>
  );
});

Video.displayName = 'Video';
