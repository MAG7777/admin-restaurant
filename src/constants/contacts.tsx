import React from 'react';
import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

import { DefaultContactOptionsTypes } from 'components/form/Contacts/ContactsSelector';
import { CustomIcon, SvgIconNames } from 'components/icons/icons';

export const contactIconsHash = {
  [DefaultContactOptionsTypes.Phone]: <PhoneOutlined />,
  [DefaultContactOptionsTypes.Email]: <MailOutlined />,
  [DefaultContactOptionsTypes.Site]: <GlobalOutlined />,
  [DefaultContactOptionsTypes.VK]: <CustomIcon name={SvgIconNames.VK} />,
  [DefaultContactOptionsTypes.OK]: <CustomIcon name={SvgIconNames.OK} />,
  [DefaultContactOptionsTypes.Telegram]: (
    <CustomIcon name={SvgIconNames.Telegram} />
  ),
  [DefaultContactOptionsTypes.YandexDzen]: (
    <CustomIcon name={SvgIconNames.YandexDzen} />
  ),
};
