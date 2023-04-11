import MediumEditor from 'medium-editor';

import { createButton } from '../helpers';

export const AnchorButton = MediumEditor.extensions.anchor.extend({
  ...createButton('anchor', 'Ссылка', 'anchor'),
  placeholderText: 'Введите ссылку',
  targetCheckbox: true,
  targetCheckboxText: 'Ссылку открывать в новом окне',
  formSaveLabel: 'Сохранить',
  formCloseLabel: 'Отменить',
  checkState: function (node) {
    if (node.href && !node.href.startsWith('mailto')) {
      this.setActive();
    }
  },
});
