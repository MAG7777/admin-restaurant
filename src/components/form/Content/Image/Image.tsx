import React from 'react';

import { ErrorTooltip } from 'components/form/ErrorTooltip';
import { TImage } from 'types/image';

import { AnnotatedImage } from './AnnotatedImage';

const WIDTH = 770;
const HEIGHT = 402;

const imageErrorHash = {
  source: 'Не заполнена ссылка на источник',
  author: 'Не указан автор изображения',
};

type TProps = {
  onChange: (value: any) => void;
  value: TImage;
  error: any;
  errorRef: any;
};

export class FormContentImage extends React.Component<TProps> {
  static displayName = 'FormContent:Image';

  static defaultProps = {
    image: null,
    onChange: () => undefined,
  };

  onImageChange = image => {
    this.props.onChange(image);
  };
  render() {
    return (
      <div ref={this.props.errorRef} tabIndex={0}>
        <AnnotatedImage
          name='hidden-image'
          value={this.props.value}
          width={WIDTH}
          height={HEIGHT}
          onChange={this.onImageChange}
        />

        {this.props.error && (
          <ErrorTooltip
            error={
              this.props.value
                ? imageErrorHash[Object.keys(this.props.error)[0]]
                : 'Загрузите файл'
            }
          />
        )}
      </div>
    );
  }
}
