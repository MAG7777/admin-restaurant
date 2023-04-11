// import React from 'react';

// import { WidgetPreview } from './WidgetPreview';
// import { Entity } from './Entity';
// import Manual from './Manual';

// type TProps = {
//   widget: any;
//   withWidgetsDescription: any;
//   name: string;
//   errors: any;
// };
// export class WidgetContent extends React.Component<TProps> {
//   render() {
//     const { widget } = this.props;
//     const Component = widget.type === 'manual' ? Manual : Entity;
//     const entity = widget[widget.type];

//     return (
//       <div className='section'>
//         <div className='part'>
//           <div className='widget-form'>
//             <Component {...this.props} />
//             {entity && (
//               <div className='widget-form_preview widget-form_item'>
//                 <WidgetPreview widget={widget} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
