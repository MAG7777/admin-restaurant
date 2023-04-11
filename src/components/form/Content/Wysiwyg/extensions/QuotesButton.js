import MediumEditor from 'medium-editor';

import { createButton } from '../helpers';

function getSelection() {
  return window.getSelection().getRangeAt(0).toString();
}

export const QuotesButton = MediumEditor.extensions.button.extend({
  ...createButton('quotes', 'Кавычки', 'quotes'),
  aria: 'Кавычки',
  action: 'wrapInQuotes',
  checkState: function () {
    const text = getSelection();

    if (text[0] === '«' && text[text.length - 1] === '»') {
      this.button.classList.add('medium-editor-button-active');
    } else {
      this.button.classList.remove('medium-editor-button-active');
    }
  },
  handleClick: function (event) {
    event.preventDefault();
    event.stopPropagation();

    let text = getSelection();

    if (this.isActive()) {
      text = text.substring(1, text.length - 1);
    } else {
      text = `«${text}»`;
    }

    this.execAction('insertText', { value: text });
    this.base.checkContentChanged();
  },
});
