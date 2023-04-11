import { Row, Space } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';

type TProps = {
  children: React.ReactNode;
};

export const FormActions: React.FC<TProps> = ({ children }) => {
  return (
    <Content style={{ paddingTop: '16px', paddingBottom: '16px' }}>
      <Row justify='end'>
        <Space size='middle' wrap>
          {children}
        </Space>
      </Row>
    </Content>
  );
};
