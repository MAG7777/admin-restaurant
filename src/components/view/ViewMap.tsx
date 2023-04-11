import React from 'react';
import { YMaps, Map as YMap, Placemark } from 'react-yandex-maps';

import { mapDefaultPosition, yandexKey } from 'constants/yandex';

interface IFormMapProps {
  mapPosition?: number[];
}

export const ViewMap: React.FC<IFormMapProps> = React.forwardRef(
  ({ mapPosition }, ref) => {
    return (
      <YMaps
        query={{
          apikey: yandexKey,
        }}
      >
        <YMap
          modules={['geocode']}
          defaultState={{
            center: mapPosition || mapDefaultPosition,
            zoom: 15,
          }}
          style={{ height: '350px', width: '100%' }}
        >
          {mapPosition && (
            <Placemark
              geometry={mapPosition}
              options={{
                iconLayout: 'default#image',
                iconImageHref: '/images/pin.svg',
                iconImageSize: [30, 39],
                iconImageOffset: [-15, -39],
                hideIconOnBalloonOpen: false,
              }}
            />
          )}
        </YMap>
      </YMaps>
    );
  }
);

ViewMap.displayName = 'ViewMap';
