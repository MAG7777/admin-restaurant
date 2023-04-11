import React from 'react';
import { FieldTimeOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';

import { useAppDispatch } from 'store';

export const ResendEmailTimer = ({ initialValue = 60, onEmailResend }) => {
  const [timerClock, setTimerClock] = React.useState<number>(initialValue);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    const timer = setTimeout(function () {
      if (timerClock <= 0) {
        clearTimeout(timer);
      } else {
        setTimerClock(timerClock - 1);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [timerClock]);
  const handleEmailResend = () => {
    dispatch(onEmailResend())
      .unwrap()
      .then(() => {
        setTimerClock(60);
      });
  };
  return (
    <div>
      {!timerClock ? (
        <Button type='primary' onClick={handleEmailResend}>
          Выслать повторно
        </Button>
      ) : (
        <Typography.Text type='secondary'>
          Выслать повторно через&nbsp;&nbsp;
          <FieldTimeOutlined />
          &nbsp;
          {timerClock}&nbsp;сек.
        </Typography.Text>
      )}
    </div>
  );
};
