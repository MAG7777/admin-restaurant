import React from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

type TProps = {
  setCropModalIsOpen: (value: boolean) => void;
  removeImage: () => void;
};
export const EditOverlay: React.FC<TProps> = ({
  setCropModalIsOpen,
  removeImage,
}) => (
  <div
    onClick={e => {
      e.stopPropagation();
    }}
    className={'upload__overlay-container'}
  >
    <Button
      onClick={() => {
        setCropModalIsOpen(true);
      }}
      size='large'
      type='link'
      icon={<EditOutlined />}
    />
    <Button
      size='large'
      onClick={() => {
        removeImage();
      }}
      type='link'
      icon={<DeleteOutlined />}
    />
  </div>
);
