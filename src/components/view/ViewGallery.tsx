import React from 'react';
import { Button, Carousel, Image, Row } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { getImageUrl } from 'utils/image';

import { ImageInfoPopover } from './components/ImageInfoPopover';

export const ViewGallery = ({ gallery }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const carouselRef = React.useRef(null);
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
      <div style={{ width: '360px' }}>
        <Carousel ref={carouselRef} afterChange={setCurrentSlideIndex}>
          {gallery.map((image, index) => {
            return (
              <div key={index}>
                <div style={{ position: 'relative' }}>
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
          })}
        </Carousel>
        <Row
          style={{
            width: '100%',
            height: '50px',
          }}
          justify='space-between'
          align='middle'
        >
          <Button onClick={() => carouselRef.current.prev()}>
            <LeftOutlined />
          </Button>
          <span>{`${currentSlideIndex + 1} / ${gallery.length}`}</span>
          <Button onClick={() => carouselRef.current.next()}>
            <RightOutlined />
          </Button>
        </Row>
      </div>
    </div>
  );
};
