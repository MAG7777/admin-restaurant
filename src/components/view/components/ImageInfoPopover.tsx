import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Typography } from 'antd';
import React from 'react';

import { TImage } from 'types/image';

type TProps = {
  image: TImage;
};

const getPopoverContent = image => {
  return (
    <div>
      <Typography.Text strong>Автор</Typography.Text>
      <div>{image.author}</div>
      <Typography.Text strong>Источник</Typography.Text>
      <div>{image.source}</div>
      {image.description && (
        <>
          <Typography.Text strong>Описание</Typography.Text>
          <div>{image.description}</div>
        </>
      )}
    </div>
  );
};

export const ImageInfoPopover: React.FC<TProps> = ({ image }) => {
  return (
    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
      <Popover
        content={getPopoverContent(image)}
        title='Информация о изображении'
      >
        <Button icon={<InfoCircleOutlined />} />
      </Popover>
    </div>
  );
};
