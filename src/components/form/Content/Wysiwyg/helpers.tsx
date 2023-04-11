import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { ToolbarButtons } from 'constants/content';

import {
  DashIcon,
  EmailIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  HyphenIcon,
  QuoteIcon,
  QuotesIcon,
} from '../icons';

const toolbarAntIconStyle = {
  fontSize: '20px',
  width: '24px',
};

const iconsHash = {
  [ToolbarButtons.BOLD]: <BoldOutlined style={toolbarAntIconStyle} />,
  [ToolbarButtons.ITALIC]: <ItalicOutlined style={toolbarAntIconStyle} />,
  [ToolbarButtons.UNDERLINE]: <UnderlineOutlined style={toolbarAntIconStyle} />,
  [ToolbarButtons.STRIKETHROUGH]: (
    <StrikethroughOutlined style={toolbarAntIconStyle} />
  ),
  [ToolbarButtons.H1]: <H1Icon />,
  [ToolbarButtons.H2]: <H2Icon />,
  [ToolbarButtons.H3]: <H3Icon />,
  [ToolbarButtons.UNORDERED_LIST]: (
    <UnorderedListOutlined style={toolbarAntIconStyle} />
  ),
  [ToolbarButtons.ORDERED_LIST]: (
    <OrderedListOutlined style={toolbarAntIconStyle} />
  ),
  [ToolbarButtons.QUOTE]: <QuoteIcon />,
  [ToolbarButtons.ANCHOR]: <LinkOutlined style={toolbarAntIconStyle} />,
  [ToolbarButtons.EMAIL]: <EmailIcon />,
  [ToolbarButtons.DASH]: <DashIcon />,
  [ToolbarButtons.HYPHEN]: <HyphenIcon />,
  [ToolbarButtons.QUOTES]: <QuotesIcon />,
};

export const createButton = (name, aria = undefined, iconName = undefined) => {
  const buttonData: {
    name: string;
    aria?: string;
    contentDefault?: string;
  } = { name };

  if (aria) {
    buttonData.aria = aria;
  }

  if (iconName) {
    const icon = iconsHash[iconName];
    buttonData.contentDefault = ReactDOMServer.renderToStaticMarkup(icon);
  }

  return buttonData;
};
