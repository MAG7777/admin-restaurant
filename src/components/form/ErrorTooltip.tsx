import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

type TProps = {
  error:
    | string
    | {
        [key: string]: any;
      };
  position?: {
    [key: string]: unknown;
  };
};
export const ErrorTooltip: React.FC<TProps> = ({ error, position = {} }) => {
  if (!error || typeof error !== 'string') return null;

  return (
    <div
      style={{ position: 'absolute', top: '12px', right: '12px', ...position }}
    >
      <Tooltip placement='top' title={error}>
        <ExclamationCircleOutlined style={{ color: 'red', fontSize: '20px' }} />
      </Tooltip>
    </div>
  );
};
