import { SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { BaseSyntheticEvent } from 'react';
import { useNavigate } from 'react-router';

interface SettingsDropdownProps {
  id: string;
}

export const SettingsDropdown = ({ id }: SettingsDropdownProps) => {
  const navigate = useNavigate();

  const onClickHandler = (event: BaseSyntheticEvent) =>
    event?.stopPropagation();

  const onEditClick = () => navigate(`${id}/edit`);

  const onRemoveClick = () => console.log('remove');

  const menuItems = [
    {
      label: 'Редактировать',
      onClick: onEditClick,
      key: 'edit',
    },
    {
      label: 'Удалить',
      danger: true,
      onClick: onRemoveClick,
      key: 'delete',
    },
  ];

  return (
    <Dropdown
      placement='bottomRight'
      trigger={['click']}
      arrow
      overlay={<Menu items={menuItems}></Menu>}
    >
      <Button
        type='text'
        icon={<SettingOutlined />}
        onClick={onClickHandler}
        style={{ height: 'auto' }}
      />
    </Dropdown>
  );
};

export default SettingsDropdown;
