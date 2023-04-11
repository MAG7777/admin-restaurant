// import React from 'react';
// import { makeAddressString } from 'sport-common/utils/entities';
// import { configSlice } from 'sport-backend/app/slices/config.slice';
// import { useSelectSlice } from 'sport-backend/app/slices/useSelectSlice';
// import { Button, notification, Row } from 'antd';
// import { Controller, useFormContext } from 'react-hook-form';

// import { MainImage } from 'components/form/MainImage/MainImage';

// import { InputField } from '../../base/InputField';
// import { TextAreaField } from '../../base/TextAreaField';
// import { FormMap } from '../../FormMap/FormMap';
// import { AddressSelector } from '../../AddressSelector/AddressSelector';

// type TProps = {
//   name: string;
//   widget: any;
// };

// export const WidgetContent: React.FC<TProps> = props => {
//   const {
//     control,
//     formState: { errors },
//     setValue,
//     getValues,
//   } = useFormContext();
//   const [isSearching, setIsSearching] = React.useState(false);
//   const [ymaps, setYmaps] = React.useState(null);
//   const config = useSelectSlice(configSlice);

//   const onMapLoad = map => {
//     setYmaps(map);
//   };

//   const setMapPosition = coordinates => {
//     setValue(
//       getFieldName('location.mapPosition'),
//       { type: 'Point', coordinates },
//       { shouldValidate: true }
//     );
//   };

//   const search = () => {
//     const address = getValues(getFieldName('location.address'));

//     if (address && ymaps) {
//       setIsSearching(true);
//       ymaps
//         .geocode(['Россия', makeAddressString(address)].join(', '), {
//           results: 1,
//           json: true,
//         })
//         .then(result => {
//           const coordinates =
//             result?.GeoObjectCollection?.metaDataProperty
//               ?.GeocoderResponseMetaData?.Point?.coordinates;
//           setIsSearching(false);
//           if (coordinates) {
//             setMapPosition(coordinates.reverse());
//           } else {
//             notification.error({
//               message: 'Адрес не найден',
//             });
//           }
//         })
//         .catch(err => {
//           notification.error({
//             message: 'Ошибка при поиске адреса',
//           });
//         });
//     }
//   };
//   const getFieldName = field => `${props.name}.${props.widget.type}.${field}`;
//   return (
//     <div>
//       <Controller
//         name={getFieldName('image')}
//         render={({ field }) => <MainImage {...field} label='' required />}
//         control={control}
//       />
//       <InputField name={getFieldName('name')} label='Название' required />
//       <TextAreaField
//         name={getFieldName('description')}
//         label='Описание'
//         placeholder='Напишите описание'
//         rows={5}
//         required
//       />
//       <InputField name={getFieldName('url')} label='Ссылка' />
//       <Row>
//         <Controller
//           name={getFieldName('location.address')}
//           defaultValue={{}}
//           render={({ field }) => (
//             <AddressSelector
//               errors={errors}
//               parts={{
//                 region: { display: false },
//                 area: { display: false },
//                 'city/settlement': { display: false },
//                 street: { display: false },
//                 house: { display: false },
//                 'area/house': {
//                   display: true,
//                   manual: true,
//                   modifiers: null,
//                   size: 24,
//                   withRemoveButton: false,
//                   // fix for restriction level set to "area" after address select
//                   restrictionLevel: 'region',
//                 },
//               }}
//               {...field}
//             />
//           )}
//           control={control}
//         />
//         <Button type='primary' onClick={search} loading={isSearching}>
//           Найти на карте
//         </Button>
//       </Row>
//       <div className='entity-form_map' style={{ marginTop: '24px' }}>
//         <Controller
//           name={getFieldName('location.mapPosition')}
//           defaultValue={{}}
//           render={({ field, fieldState }) => (
//             <FormMap
//               onMapLoad={onMapLoad}
//               onChange={coordinates =>
//                 field.onChange({ type: 'Point', coordinates })
//               }
//               value={field.value}
//               {...(!field.value?.coordinates && {
//                 bounds: config.system.ymaps.bounds,
//               })}
//               errors={fieldState.error}
//             />
//           )}
//           control={control}
//         />
//       </div>
//     </div>
//   );
// };

// export default WidgetContent;
