// import React from 'react';
// import Input from 'antd/lib/input/Input';

// import { TextAreaField } from 'components/form/base/TextAreaField';
// // import { ArticlesSelect } from '../../selects/ArticlesSelect';
// // import { EventsSelect } from '../../selects/EventsSelect';
// // import { PlaceSelect } from '../../selects/PlaceSelect';
// // import { TextAreaField } from '../../base/TextAreaField';

// type TProps = {
//   widget: any;
//   withWidgetsDescription: any;
//   name: string;
//   errors: any;
// };

// export class Entity extends React.Component<TProps> {
//   getWidgetParamsHash(type) {
//     const hash = {
//       article: {
//         Component: Input,
//         label: 'Название статьи',
//         // mode: 'single',
//         // requestData: {
//         //   locales,
//         //   fields: [
//         //     '_id',
//         //     'description',
//         //     'image',
//         //     'name',
//         //     'sysName'
//         //   ],
//         //   isPublished: true
//         // }
//       },
//       event: {
//         Component: Input,
//         label: 'Название события',
//         // mode: 'single',
//         // requestData: {
//         //   locales,
//         //   fields: [
//         //     '_id',
//         //     'description',
//         //     'image',
//         //     'name',
//         //     'schedules',
//         //     'sysName'
//         //   ],
//         //   isPublished: true
//         // }
//       },
//       place: {
//         Component: Input,
//         label: 'Название места',
//         // mode: 'single',
//         // requestData: {
//         //   locales,
//         //   fields: [
//         //     '_id',
//         //     'address',
//         //     'description',
//         //     'image',
//         //     'mapPosition',
//         //     'name',
//         //     'sysName'
//         //   ],
//         //   isPublished: true
//         // }
//       },
//     };

//     return hash[type];
//   }

//   render() {
//     const { widget, withWidgetsDescription } = this.props;
//     const hash = this.getWidgetParamsHash(widget.type);
//     const { Component } = hash;
//     return (
//       <React.Fragment>
//         <Component
//           name={`${this.props.name}.${widget.type}`}
//           // requestData={hash.requestData}
//           errors={this.props.errors}
//           {...hash}
//         />
//         {withWidgetsDescription && (
//           <TextAreaField
//             name={`${this.props.name}.entityDescription`}
//             label=''
//             placeholder='Напишите описание'
//             rows={5}
//           />
//         )}
//       </React.Fragment>
//     );
//   }
// }
