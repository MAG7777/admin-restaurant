import React from 'react';
import { Col, Row } from 'antd';

import { LocationSelector } from 'components/form/AddressSelector/LocationSelector';
import { MainImage } from 'components/form/MainImage/MainImage';
import { InputField } from 'components/form/base/InputField';
import { UploadAudio } from 'components/form/UploadAudio/UploadAudio';
import { Content } from 'components/form/Content/Content';
import { DurationField } from 'components/form/DurationField/DurationField';

export const ManualPoint = ({ name }) => {
  return (
    <>
      <Row gutter={[16, 0]}>
        <Col flex={'0 0 100px'}>
          <MainImage name={`${name}.image`} label='Глав. фото' required />
        </Col>
        <Col flex={1}>
          <InputField
            name={`${name}.routeName`}
            label='Название геометки'
            required
            placeholder='Введите название'
            showCount
            maxLength={255}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <InputField
            name={`${name}.shortDescription`}
            label='Краткое описание'
            required
            placeholder='Описание'
            showCount
            maxLength={150}
          />
        </Col>
      </Row>
      <Row gutter={[24, 0]} align='bottom'>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <DurationField
            name={`${name}.duration`}
            label='Длительность остановки'
          />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <UploadAudio name={`${name}.audio`} />
        </Col>
      </Row>
      <LocationSelector name={`${name}.address`} />
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Content
            name={`${name}.description`}
            label='Описание'
            placeholder='Начните печатать текст'
            withWidgetsDescription
            withPreparingForModeration
            required
            enabledTypes={[]}
          />
        </Col>
      </Row>
    </>
  );
};
