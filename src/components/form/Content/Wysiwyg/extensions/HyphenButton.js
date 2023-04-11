import MediumEditor from 'medium-editor';

import { createButton } from '../helpers';

export const HyphenButton = MediumEditor.extensions.button.extend({
  ...createButton('hyphen', 'Тире', 'hyphen'),
  aria: 'Дефис',
  action: 'insertHyphen',
  handleClick: function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.base.cleanPaste('‐');
    this.base.checkContentChanged();
  },
});
