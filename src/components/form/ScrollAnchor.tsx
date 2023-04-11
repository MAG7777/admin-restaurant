import React from 'react';

type TProps = {
  error: any;
};
export const ScrollAnchor: React.FC<TProps> = ({ error }) => {
  if (error) {
    return <div data-scroll-anchor='true' style={{ position: 'absolute' }} />;
  }

  return null;
};

ScrollAnchor.defaultProps = {
  error: null,
};
