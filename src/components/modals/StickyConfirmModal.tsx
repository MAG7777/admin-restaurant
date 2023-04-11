import React from 'react';
import { ButtonProps, Checkbox, Modal, Row } from 'antd';

type TProps = {
  title?: string;
  isOpen: boolean;
  onRequestClose: () => any;
  onSubmit: () => any;
  okText?: string | React.ReactNode;
  cancelText?: string | React.ReactNode;
  text: string | React.ReactNode;
  withConfirmCheckbox?: boolean;
  confirmCheckboxText?: string | React.ReactNode;
  cancelButtonProps?: ButtonProps;
  okButtonProps?: ButtonProps;
};

export const StickyConfirmModal: React.FC<TProps> = ({
  title = 'Подтверждение',
  isOpen,
  onRequestClose,
  onSubmit,
  okText = 'Подтвердить',
  cancelText = 'Отмена',
  text,
  withConfirmCheckbox = false,
  confirmCheckboxText,
  cancelButtonProps = {},
  okButtonProps = {},
}) => {
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  return (
    <Modal
      title={title}
      visible={isOpen}
      onCancel={onRequestClose}
      maskClosable={false}
      okText={okText}
      cancelText={cancelText}
      cancelButtonProps={cancelButtonProps}
      okButtonProps={
        withConfirmCheckbox
          ? { ...okButtonProps, disabled: !isConfirmed }
          : okButtonProps
      }
      width='500px'
      onOk={onSubmit}
    >
      <Row>{text}</Row>
      {withConfirmCheckbox && (
        <Row style={{ marginTop: '8px' }}>
          <Checkbox onChange={e => setIsConfirmed(e.target.checked)}>
            {confirmCheckboxText}
          </Checkbox>
        </Row>
      )}
    </Modal>
  );
};
