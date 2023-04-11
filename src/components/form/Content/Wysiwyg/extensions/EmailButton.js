import MediumEditor from 'medium-editor';

import { createButton } from '../helpers';

export const EmailButton = MediumEditor.extensions.anchor.extend({
  ...createButton('email', 'Email', 'email'),
  placeholderText: 'Введите email ссылку',
  formSaveLabel: 'Сохранить',
  formCloseLabel: 'Отменить',
  checkState: function (node) {
    if (node.href && node.href.startsWith('mailto')) {
      this.setActive();
    }
  },
  doFormSave: function () {
    const opts = this.getFormOpts();
    this.completeFormSave({
      ...opts,
      value: `mailto:${opts.value}`,
    });
  },
});
