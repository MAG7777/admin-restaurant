import React from 'react';
import { YMaps, Map as YMap, Placemark, YMapsApi } from 'react-yandex-maps';
import { useFormContext, useWatch } from 'react-hook-form';

import { mapDefaultPosition, yandexKey } from 'constants/yandex';

interface IFormMapProps {
  onChange: (coord: number[]) => void;
  onMapLoad: (ymaps: YMapsApi) => void;
  name: string;
}

type TYMapEvent = {
  get: (value: string) => number[];
};

type TYMapOptions = {
  duration: number;
  timingFunction: 'ease-in-out' | string;
};

type TYMapRef = {
  setCenter: (
    coordinates: number[],
    zoom: number,
    options: TYMapOptions
  ) => void;
  getZoom: () => number;
};

const ymapOptions = { duration: 500, timingFunction: 'ease-in-out' };

export const FormMap: React.FC<IFormMapProps> = React.forwardRef(
  ({ onChange, onMapLoad, name }, ref) => {
    const [mapRef, setMapRef] = React.useState<TYMapRef | null>(null);

    const { control } = useFormContext();

    const mapPosition = useWatch({ name: `${name}.mapPosition`, control });

    React.useEffect(() => {
      if (mapRef && mapPosition) {
        mapRef.setCenter(mapPosition, 18, ymapOptions);
      }
    }, [mapPosition]);

    const handleYmapsLoad = (ymaps: YMapsApi) => {
      onMapLoad(ymaps);
    };

    const onClickMapPosition = (coordinates: number[]) => {
      if (mapRef) {
        mapRef.setCenter(coordinates, mapRef.getZoom(), ymapOptions);
      }
    };

    return (
      <YMaps
        query={{
          apikey: yandexKey,
        }}
      >
        <YMap
          onLoad={ymaps => handleYmapsLoad(ymaps)}
          instanceRef={ref => setMapRef(ref as unknown as TYMapRef)}
          modules={['geocode']}
          defaultState={{
            center: mapPosition || mapDefaultPosition,
            zoom: mapPosition ? 18 : 6,
          }}
          style={{ height: '350px', width: '100%' }}
          onClick={(event: TYMapEvent) => {
            onChange(event.get('coords'));
            onClickMapPosition(event.get('coords'));
          }}
        >
          {mapPosition && (
            <Placemark
              geometry={mapPosition}
              options={{
                iconLayout: 'default#image',
                iconImageHref: '/public/images/pin.svg',
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

FormMap.displayName = 'FormMap';
