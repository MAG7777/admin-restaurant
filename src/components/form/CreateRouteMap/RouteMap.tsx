import React from 'react';
import { YMaps, Map as YMap, Placemark, Polyline } from 'react-yandex-maps';

interface IFormMapProps {
  onChange: (coord: number[]) => void;
  editMode?: boolean;
  height: number;
  pointsValue: any[];
  polylineValue: any[];
}

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

const yandexKey = '4e372f4e-c5f2-47e8-894f-cf8bcf51b7a3'; // Todo: перенести в config.json, когда он будет работать
const defaultPosition = [44.03929, 43.07084]; // Координаты Северного Кавказа

export const RouteMap: React.FC<IFormMapProps> = ({
  height,
  onChange,
  editMode = false,
  pointsValue = [],
  polylineValue = [],
}) => {
  const [ymaps, setYmaps] = React.useState(null); // это ссылка на yandex-map API
  const [mapRef, setMapRef] = React.useState(null); // это сслыка на инстанс карты
  const [polylineRef, setPolRef] = React.useState(null); // это сслыка на Polyline
  const [placeMarkList, setPlaceMarkList] = React.useState([]);
  React.useEffect(() => {
    if (ymaps && mapRef) {
      if (placeMarkList.length > 1) {
        const points = placeMarkList.map(p => p.coords);
        if (polylineValue) {
          points.push(...polylineValue);
        }
        mapRef.setBounds(ymaps.util.bounds.fromPoints(points));
      }
      if (placeMarkList.length === 1) {
        mapRef.setCenter(placeMarkList[0].coords);
      }
    }
  }, [ymaps, placeMarkList]);

  React.useEffect(() => {
    if (pointsValue.length) {
      setPlaceMarkList(pointsValue);
    }
  }, [pointsValue]);

  React.useEffect(() => {
    if (polylineRef) {
      const startEditBtn = new ymaps.control.Button({
        data: {
          content: 'Редактировать маршрут',
        },
        options: {
          selectOnClick: false,
          visible: true,
          maxWidth: 250,
        },
      });
      const finishEditBtn = new ymaps.control.Button({
        data: {
          content: 'Завершить',
        },
        options: {
          selectOnClick: false,
          visible: false,
          maxWidth: 250,
        },
      });
      const clearBtn = new ymaps.control.Button({
        data: {
          content: 'Очистить',
        },
        options: {
          selectOnClick: false,
          visible: false,
          maxWidth: 250,
        },
      });
      startEditBtn.events.add('click', () => {
        finishEditBtn.options.set('visible', true);
        clearBtn.options.set('visible', true);
        startEditBtn.options.set('visible', false);
        polylineRef.editor.startEditing();
        polylineRef.editor.startDrawing();
      });
      finishEditBtn.events.add('click', () => {
        startEditBtn.options.set('visible', true);
        finishEditBtn.options.set('visible', false);
        clearBtn.options.set('visible', false);
        polylineRef.editor.stopEditing();
        const coords = polylineRef.geometry._childPath._children.map(
          elem => elem._coordinates
        );
        onChange(coords);
      });
      clearBtn.events.add('click', () => {
        startEditBtn.options.set('visible', true);
        finishEditBtn.options.set('visible', false);
        clearBtn.options.set('visible', false);
        polylineRef.editor.stopEditing();
        onChange([]);
      });
      if (editMode) {
        // тут добавляются кнопки редактирования маршрута
        // пример из индекс доки https://yandex.ru/dev/maps/jsbox/2.1/button/
        mapRef.controls.add(startEditBtn, { float: 'right' });
        mapRef.controls.add(clearBtn, { float: 'right' });
        mapRef.controls.add(finishEditBtn, { float: 'right' });
      }
    }
  }, [polylineRef]);

  React.useEffect(() => {
    if (mapRef) {
      // удаление стандартных модулей управления
      // ссылка на документацию яндекса https://yandex.ru/dev/maps/jsapi/doc/2.1/dg/concepts/controls/work.html
      mapRef.controls.remove('geolocationControl');
      mapRef.controls.remove('searchControl');
    }
  }, [mapRef]);

  return (
    <YMaps
      query={{
        apikey: yandexKey,
        load: 'package.full',
      }}
    >
      <YMap
        height={height}
        width='100%'
        onLoad={ymaps => setYmaps(ymaps)}
        instanceRef={ref => setMapRef(ref as unknown as TYMapRef)}
        options={{
          searchControlProvider: 'yandex#search',
          suppressMapOpenBlock: true,
        }}
        defaultState={{
          controls: ['zoomControl'],
          center: defaultPosition,
          zoom: 10,
        }}
        modules={['templateLayoutFactory', 'clusterer.addon.balloon']}
      >
        {placeMarkList.length
          ? placeMarkList.map((item, index) => (
              <Placemark
                key={index}
                geometry={item.coords}
                properties={{
                  iconContent: item.content
                    ? `<div style="width: 18px">${item.content}</div>`
                    : undefined,
                }}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                options={{
                  draggable: false,
                  preset: 'islands#icon',
                  iconColor: '#943289',
                  iconImageSize: [40, 52],
                  iconImageOffset: [-5, -38],
                  iconContent: '1',
                }}
                onClick={(...args) => {
                  if (item.onClick) {
                    item.onClick(...args);
                  }
                }}
              />
            ))
          : ''}
        {((polylineValue && polylineValue.length > 0) || editMode) && (
          <Polyline
            instanceRef={ref => setPolRef(ref)}
            geometry={polylineValue}
            options={{
              strokeColor: '#943289',
              strokeWidth: 3,
              strokeOpacity: 1,
              editorMenuManager: (items, { geometry }) => {
                // ссылка на документацию в яндекс https://yandex.ru/dev/maps/jsbox/2.1/polylineEditor/
                const coords = geometry._coordinates; // получение координат всего Polyline
                setTimeout(() => {
                  // setTimeout нужен что бы код попал в event loop микро тасок и выполнился уже после отрисовки меню
                  const menuElem = document.querySelector(
                    '.ymaps-2-1-79-islets_editor-vertex-menu'
                  );
                  // получение ссылки на меню которое отображает список действий
                  if (menuElem) {
                    menuElem.children[0].addEventListener('click', () => {
                      setPlaceMarkList(prev =>
                        prev.filter(
                          elem =>
                            elem.coords[0] !== coords[0] &&
                            elem.coords[1] !== coords[1]
                        )
                      );
                    });
                  }
                }, 0);
                return items;
              },
            }}
          />
        )}
      </YMap>
    </YMaps>
  );
};
