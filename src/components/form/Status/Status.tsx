import { Col, Row } from 'antd';
import React from 'react';

import { Statuses, StatusesEnum, statusesNamesHash } from 'constants/status';
import { omit } from 'utils/helpers';

import { Select } from '../base/Select';
import { InputField } from '../base/InputField';

type TProps = {
  status?: Statuses;
  withSourceInput?: boolean;
};

export const Status: React.FC<TProps> = ({ status, withSourceInput }) => {
  // const [dateIsPlanned, setDateIsPlanned] = React.useState(false);
  // const [statusOptions, setStatusOptions] = React.useState<any>([]);

  // const { setValue } = useFormContext();

  // React.useEffect(() => {
  //   if (dateIsPlanned) {
  //     const selectValue = {
  //       value: StatusesEnum.TO_BE_PUBLISHED,
  //       label: statusesNamesHash[StatusesEnum.TO_BE_PUBLISHED],
  //     };
  //     setStatusOptions([selectValue]);
  //     setValue('status', selectValue);
  //   } else {
  //     setStatusOptions([
  //       ...Object.keys(omit(statusesNamesHash, StatusesEnum.TO_BE_PUBLISHED)).map(item => {
  //         return {
  //           value: item,
  //           label: statusesNamesHash[item],
  //         };
  //       }),
  //     ]);
  //     setValue('publishAt', null);
  //     setValue('status', null);
  //   }
  // }, [dateIsPlanned]);

  return (
    <Row gutter={[24, 0]}>
      <Col lg={{ span: 8 }} sm={{ span: 24 }}>
        {/* <Row align='middle' gutter={[16, 0]}>
          <Col>
            <Switch
              defaultChecked={dateIsPlanned}
              onChange={value => {
                setDateIsPlanned(value);
              }}
            />
          </Col>
          <Col style={{ marginTop: '2px' }}>Указать дату публикации</Col>
        </Row>
        <div style={{ marginTop: '24px' }}>
          <DatePicker
            name='publishAt'
            required={dateIsPlanned}
            label='Дата публикации'
            disabled={!dateIsPlanned}
            minDateRestriction={dayjs().valueOf()}
          />
        </div> */}
        <div>
          <Select
            name='status'
            label='Статус'
            options={[
              ...Object.keys(
                omit(statusesNamesHash, [
                  // StatusesEnum.TO_BE_PUBLISHED,
                  StatusesEnum.DRAFT,
                  ...(!(status === StatusesEnum.PUBLISHED) &&
                  !(status === StatusesEnum.NOT_PUBLISHED)
                    ? [StatusesEnum.NOT_PUBLISHED]
                    : []),
                ])
              ).map(item => {
                return {
                  value: item,
                  label: statusesNamesHash[item],
                };
              }),
            ]}
            // disabled={dateIsPlanned}
          />
        </div>
      </Col>
      {withSourceInput && (
        <Col lg={{ span: 12 }} xs={{ span: 24 }}>
          <InputField
            name='source'
            label='Источник'
            placeholder='Введите источник'
            showCount
            maxLength={30}
          />
        </Col>
      )}
    </Row>
  );
};
