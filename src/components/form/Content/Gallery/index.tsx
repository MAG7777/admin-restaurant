import React from 'react';

import Gallery from './Gallery';

type TProps = {
  onChange: (value: any) => void;
  value: any;
};
export class GalleryContent extends React.Component<TProps> {
  static defaultProps = {
    value: [],
  };

  onGalleryChange = gallery => {
    this.props.onChange(gallery);
  };

  render() {
    return (
      <Gallery
        {...this.props}
        value={this.props.value}
        onChange={this.onGalleryChange}
      />
    );
  }
}
