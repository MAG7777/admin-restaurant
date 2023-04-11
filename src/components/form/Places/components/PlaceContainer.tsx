import React from 'react';
import { Button, Form, Row, Typography } from 'antd';
import { DeleteOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { useFormContext, useWatch } from 'react-hook-form';
import { Content as AntContent } from 'antd/lib/layout/layout';
import classNames from 'classnames';

import { IAttractionAddress } from 'types/address';

import { PlaceItemContent } from './PlaceItemContent';
import styles from './PlaceContainer.module.less';
import { defaultScheduleDump } from './formUtils';

export type onChangeValueType = {
  type?: string;
  workTimeType: string;
  address?: IAttractionAddress;
  schedule?: typeof defaultScheduleDump;
};

interface IPlaceItemProps {
  name: string;
  number: number;
  handleClear: () => void;
  onChange: (value: onChangeValueType) => void;
  children: React.ReactNode;
  error: any;
}

export const PlaceContainer: React.FC<IPlaceItemProps> = React.forwardRef(
  ({ name, number, handleClear, onChange, children, error }, ref) => {
    const [isOpenContent, setIsOpenContent] = React.useState(true);
    const { control } = useFormContext();
    const value = useWatch({ name, control });

    return (
      <Form.Item
        help={error ? 'Проверьте правильность заполнения полей' : ''}
        validateStatus={error ? 'error' : 'success'}
      >
        <Row
          className={classNames(styles.placeContainer, {
            [styles.error]: error,
          })}
        >
          <Row
            className={classNames(
              styles.placeHeaderContainer,
              !isOpenContent && {
                [styles.isOpenContent]: !isOpenContent,
              },
              isOpenContent && {
                [styles.error]: error,
              }
            )}
            justify='space-between'
            wrap={false}
          >
            <div
              className={styles.placeHeaderTextArea}
              onClick={() => setIsOpenContent(!isOpenContent)}
            >
              <Typography.Text className={styles.placeHeaderText}>
                {value.place ? value.place.name : `${number}. Место проведения`}
              </Typography.Text>
            </div>
            <div className={styles.actionContainer}>
              <Button
                danger
                type='text'
                onClick={handleClear}
                icon={<DeleteOutlined />}
              />
              <Button
                type='text'
                style={{ marginRight: 8 }}
                onClick={() => setIsOpenContent(!isOpenContent)}
                icon={isOpenContent ? <RightOutlined /> : <DownOutlined />}
              />
            </div>
          </Row>

          {isOpenContent && (
            <AntContent style={{ minWidth: 0 }}>
              <PlaceItemContent name={name} onChange={onChange} error={error}>
                {children}
              </PlaceItemContent>
            </AntContent>
          )}
        </Row>
      </Form.Item>
    );
  }
);

PlaceContainer.displayName = 'PlaceContainer';
