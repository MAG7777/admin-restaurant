import {
  AppstoreAddOutlined,
  CameraOutlined,
  PlusOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

import { ContentType } from './contentTypes';

type TToolbarButton = {
  type: string;
  icon: React.ReactNode;
  title: string;
  options?: {
    type: string;
  };
};

const buttons: TToolbarButton[] = [
  {
    type: 'image',
    icon: <CameraOutlined />,
    title: 'Изображение',
  },
  {
    type: 'gallery',
    icon: <AppstoreAddOutlined />,
    title: 'Галерея',
  },
  {
    type: 'video',
    icon: <VideoCameraAddOutlined />,
    title: 'Видео',
  },
  // {
  //   type: 'widget',
  //   icon: <CalendarOutlined style={{ fontSize: '20px' }} />,
  //   title: 'Событие',
  //   options: { type: 'event' },
  // },
  // {
  //   type: 'widget',
  //   icon: <AimOutlined style={{ fontSize: '20px' }} />,
  //   title: 'Место',
  //   options: { type: 'place' },
  // },
  // {
  //   type: 'widget',
  //   icon: <EditOutlined style={{ fontSize: '20px' }} />,
  //   title: 'Статья',
  //   options: { type: 'article' },
  // },
  // {
  //   type: 'widget',
  //   icon: 'circle-geotag',
  //   title: 'Геометка',
  //   options: { type: 'manual' },
  // },
];

type TProps = {
  onAddItem: (type: any, options: any) => any;
  onOpenClick: () => void;
  open?: boolean;
  enabledTypes: ContentType[];
};

export const Toolbar: React.FC<TProps> = ({
  onAddItem,
  onOpenClick,
  open = false,
  enabledTypes,
}) => {
  const toolbarItems = buttons
    .filter(({ type }) => enabledTypes.includes(type as ContentType))
    .map((data, index) => {
      return (
        <button
          key={index}
          type='button'
          className='toolbar_list-item'
          title={data.title}
          onClick={() => onAddItem(data.type, data.options)}
        >
          {data.icon}
        </button>
      );
    });

  return (
    <div className='toolbar'>
      <button type='button' className='toolbar_close' onClick={onOpenClick}>
        <div
          className={classNames('toolbar_icon', {
            toolbar_icon__rotated: open,
          })}
        >
          <PlusOutlined style={{ fontSize: '20px' }} />
        </div>
        {/* <Icon
          icon="clear"
          className={classNames(
            'toolbar_icon',
            'toolbar_icon__close',
            { toolbar_icon__rotated: !open }
          )}
        /> */}
      </button>

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={open}
        timeout={640}
        classNames={{
          enter: 'toolbar_list__enter',
          enterActive: 'toolbar_list__enter-active',
          exit: 'toolbar_list__exit',
          exitActive: 'toolbar_list__exit-active',
        }}
      >
        <div className='toolbar_list'>{toolbarItems}</div>
      </CSSTransition>
    </div>
  );
};
