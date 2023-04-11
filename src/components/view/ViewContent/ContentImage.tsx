import { Image } from 'antd';
import React from 'react';

import { TImage } from 'types/image';
import { getImageUrl } from 'utils/image';

import { ImageInfoPopover } from '../components/ImageInfoPopover';

type TProps = {
  image: TImage;
};

export const ContentImage: React.FC<TProps> = ({ image }) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '50px',
        marginBottom: '50px',
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <Image
          width={360}
          height={240}
          preview={false}
          src={
            image
              ? getImageUrl(image, 360, 240) || '/images/no-image.svg'
              : '/images/no-image.svg'
          }
          fallback='/images/no-image.svg'
          style={{ flexShrink: 0 }}
        />
        <ImageInfoPopover image={image} />
      </div>
    </div>
  );
};
