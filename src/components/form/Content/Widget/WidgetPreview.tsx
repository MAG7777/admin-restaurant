// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Map } from 'sport-backend/app/components/common/Map';
// import { ImagePreview } from 'sport-backend/app/common/ui-kit/components/form';
// import { getImageUrl } from 'sport-common/utils/image';
// import { makeAddressString } from 'sport-common/utils/entities';

// const entitiesHash = {
//   article: {
//     entityType: 'articles',
//     title: 'Статья',
//   },
//   event: {
//     entityType: 'events',
//     title: 'Событие',
//   },
//   place: {
//     entityType: 'places',
//     title: 'Место',
//   },
//   manual: { title: 'Геометка' },
// };

// type TProps = {
//   widget: any;
// };

// export const WidgetPreview: React.FC<TProps> = ({ widget }) => {
//   const entity = { ...widget[widget.type] };
//   const entityUrl =
//     widget.type === 'manual'
//       ? entity.url
//       : `/${entitiesHash[widget.type].entityType}/${entity._id}`;

//   if (widget.entityDescription) {
//     entity.description = widget.entityDescription;
//   }
//   const withMap = !entity.image && entity?.location?.mapPosition?.coordinates;

//   const map = withMap && (
//     <Map
//       markers={[{ coordinates: entity.location.mapPosition.coordinates }]}
//       static
//     />
//   );
//   const address = entity.address || entity.location?.address;
//   return (
//     <div className='content-widget'>
//       <div className='content-widget_content'>
//         {entity.image && (
//           <Link
//             className='content-widget_image-link'
//             {...(entityUrl && {
//               href: entityUrl,
//               target: '_blank',
//             })}
//           >
//             <ImagePreview
//               className='content-widget_image'
//               value={entity.image}
//               width={800}
//               height={485}
//               alt={entity.name}
//               getImageUrl={getImageUrl}
//             />
//             <ImagePreview
//               className='content-widget_image'
//               value={entity.image}
//               width={175}
//               height={175}
//               alt={entity.name}
//               getImageUrl={getImageUrl}
//             />
//           </Link>
//         )}
//         {withMap && (
//           <React.Fragment>
//             <div className='content-widget_map'>{map}</div>
//             <div className={'content-widget_map'}>{map}</div>
//           </React.Fragment>
//         )}
//         <div className='content-widget_info'>
//           <div className='content-widget_type'>
//             {entitiesHash[widget.type].title}
//           </div>
//           <Link className='content-widget_title' to={entityUrl} target='_blank'>
//             {entity.name}
//           </Link>
//           {address && (
//             <div>{makeAddressString(address, { withComment: true })}</div>
//           )}
//           <div className='content-widget_description'>{entity.description}</div>
//         </div>
//       </div>
//     </div>
//   );
// };
