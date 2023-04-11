import React from 'react';
import { Row } from 'antd';

import { TContentBlock } from 'components/form/Content/contentTypes';

import { ContentVideo } from './ContentVideo';
import { Text } from './Text';
import { ContentImage } from './ContentImage';
import { ViewGallery } from '../ViewGallery';

const contentTypeHash = {
  image: ContentImage,
  gallery: ViewGallery,
  text: Text,
  video: ContentVideo,
};

type TProps = {
  content: TContentBlock[];
};

export const ViewContent: React.FC<TProps> = ({ content }) => {
  return (
    <div style={{ width: '100%' }}>
      {content.map((contentItem, index) => {
        const Component = contentTypeHash[contentItem.type];

        return (
          Component && (
            <Row key={index}>
              <Component {...contentItem} />
            </Row>
          )
        );
      })}
    </div>
  );
};
