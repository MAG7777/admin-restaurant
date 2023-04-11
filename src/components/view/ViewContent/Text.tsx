import React from 'react';

import { addTargetBlankToLinks } from 'utils/html';

type TProps = {
  text: string;
};

export const Text: React.FC<TProps> = ({ text }) => {
  const preparedText = addTargetBlankToLinks(text);

  return (
    <div
      className='content_text content_text__view'
      dangerouslySetInnerHTML={{ __html: preparedText }}
    />
  );
};
