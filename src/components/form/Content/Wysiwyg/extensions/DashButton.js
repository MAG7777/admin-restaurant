import MediumEditor from 'medium-editor';

import { createButton } from '../helpers';

export const DashButton = MediumEditor.extensions.button.extend({
  ...createButton('dash', 'Тире', 'dash'),
  aria: 'Тире',
  action: 'insertDash',
  handleClick: function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.base.cleanPaste('&mdash;');
    this.base.checkContentChanged();
  },
});
