import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import React from 'react';

type TProps = {
  slide: any;
  slides: any;
  onPrevClick: () => void;
  onNextClick: () => void;
};
export const GalleryCounter: React.FC<TProps> = ({
  slide,
  slides,
  onPrevClick,
  onNextClick,
}) => {
  return (
    <Row align='middle' justify='center'>
      <Button icon={<LeftOutlined />} size='large' onClick={onPrevClick} />
      <div style={{ margin: '0 24px' }}>
        {slide}/{slides}
      </div>
      <Button icon={<RightOutlined />} size='large' onClick={onNextClick} />
    </Row>
  );
};
