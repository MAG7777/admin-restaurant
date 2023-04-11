import {
  DeleteOutlined,
  DownloadOutlined,
  PaperClipOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, notification, Row, Tooltip, Typography, Upload } from 'antd';
import React from 'react';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

import { MAX_AUDIO_FILE_SIZE } from 'constants/upload';
import { uploadAudio } from 'utils/upload';

export const BaseUploadAudio = ({ value, onChange }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileChange = async info => {
    const isMp3 = info.file.type === 'audio/mpeg';
    if (!isMp3) {
      return notification.error({
        message: 'Неверный формат. Пожалуйста, выберите файл с форматом .mp3',
      });
    }
    const isLt2M = info.file.size < MAX_AUDIO_FILE_SIZE;
    if (!isLt2M) {
      return notification.error({
        message: 'Пожалуйста, выберите файл с размером не более 10 МБ',
      });
    }
    let result = null;
    setIsLoading(true);
    try {
      result = await uploadAudio(info);
    } catch (error) {
      notification.error({
        message: error,
      });
    }

    setIsLoading(false);
    onChange(result);
  };

  const dummyRequest = ({ onSuccess }: RcCustomRequestOptions) => {
    /**
     эта штука позволяет убрать отправку стандартного запроса в анте
     **/
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };
  return (
    <Row align='middle' wrap={false}>
      {!value ? (
        <>
          <Upload
            accept={'audio/*'}
            name='audio'
            listType='picture'
            customRequest={dummyRequest}
            onChange={handleFileChange}
            showUploadList={false}
            fileList={[]}
          >
            <Button icon={<DownloadOutlined />} loading={isLoading}>
              Добавить аудиофайл
            </Button>
          </Upload>
          <Tooltip
            title={
              <div>
                <Typography.Text className='white_text' strong>
                  Требования к файлу:
                </Typography.Text>
                <ul>
                  <li>максимальный размер - 10 МБ</li>
                  <li>формат - mp3</li>
                </ul>
              </div>
            }
          >
            <QuestionCircleOutlined
              style={{ marginLeft: '14px', cursor: 'help' }}
            />
          </Tooltip>
        </>
      ) : (
        <Row align='middle' style={{ width: '100%' }} wrap={false}>
          <PaperClipOutlined
            style={{
              color: '#8C8C8C',
            }}
          />
          <a
            style={{
              minWidth: 0,
              marginLeft: '8px',
              marginRight: '8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            target='_blank'
            href={`${value.baseUrl}/${value.name}`}
            rel='noreferrer'
          >
            {value.realName}
          </a>
          <Button
            type='text'
            icon={<DeleteOutlined />}
            onClick={() => onChange(null)}
            style={{
              marginLeft: 'auto',
              color: '#8C8C8C',
            }}
          />
        </Row>
      )}
    </Row>
  );
};
