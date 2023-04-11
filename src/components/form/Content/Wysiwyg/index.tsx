import React from 'react';
import MediumEditor from 'medium-editor';

import { isWysiwygValueEmpty, wrapInsideHtmlParagraph } from 'utils/wysiwyg';
import { stripTagsAndTrim } from 'utils/helpers';
import { ToolbarButtons } from 'constants/content';

import { createButton } from './helpers';
import { AnchorButton } from './extensions/AnchorButton';
import { DashButton } from './extensions/DashButton';
import { EmailButton } from './extensions/EmailButton';
import { HyphenButton } from './extensions/HyphenButton';
import { QuotesButton } from './extensions/QuotesButton';

type TProps = {
  placeholder: string;
  children: React.ReactNode;
  onChange: (value: any) => void;
  onCaretPositionChange: (value: any) => void;
};

export class Wysiwyg extends React.Component<TProps> {
  static defaultProps = {
    children: null,
    placeholder: '',
    onChange: () => undefined,
    onCaretPositionChange: () => undefined,
  };
  mediumEditor;
  element;

  componentDidMount() {

    this.mediumEditor = new MediumEditor(this.element, {
      placeholder: {
        text: this.props.placeholder
      },
      autoLink: true,
      toolbar: {
        buttons: [
          createButton(ToolbarButtons.BOLD, 'Полужирный', ToolbarButtons.BOLD),
          createButton(ToolbarButtons.ITALIC, 'Курсив', ToolbarButtons.ITALIC),
          createButton(
            ToolbarButtons.UNDERLINE,
            'Подчёркнутый',
            ToolbarButtons.UNDERLINE
          ),
          createButton(
            ToolbarButtons.STRIKETHROUGH,
            'Зачёркнутый',
            ToolbarButtons.STRIKETHROUGH
          ),
          createButton(ToolbarButtons.H1, 'Заголовок', ToolbarButtons.H1),
          createButton(ToolbarButtons.H2, 'Заголовок', ToolbarButtons.H2),
          createButton(ToolbarButtons.H3, 'Заголовок', ToolbarButtons.H3),
          createButton(
            ToolbarButtons.UNORDERED_LIST,
            'Маркированный список',
            ToolbarButtons.UNORDERED_LIST
          ),
          createButton(
            ToolbarButtons.ORDERED_LIST,
            'Нумерованный список',
            ToolbarButtons.ORDERED_LIST
          ),
          createButton(ToolbarButtons.QUOTE, 'Цитата', ToolbarButtons.QUOTE),
          createButton(ToolbarButtons.QUOTES),
          createButton(ToolbarButtons.DASH),
          createButton(ToolbarButtons.HYPHEN),
          createButton(ToolbarButtons.EMAIL),
          createButton(ToolbarButtons.ANCHOR),
        ],
      },
      extensions: {
        anchor: new AnchorButton(),
        email: new EmailButton(),
        quotes: new QuotesButton(),
        dash: new DashButton(),
        hyphen: new HyphenButton(),
      },
    });

    const { onChange, onCaretPositionChange } = this.props;

    this.mediumEditor.subscribe('editableInput', () => {
      onChange(this.getValue());
    });

    this.mediumEditor.setContent(this.prepareText(this.props.children));
    this.mediumEditor.subscribe('editableClick', onCaretPositionChange);
    this.mediumEditor.subscribe('editableKeyup', onCaretPositionChange);
  }

  shouldComponentUpdate(nextProps) {
    return this.getValue() !== this.prepareText(nextProps.children);
  }

  componentWillUnmount() {
    this.mediumEditor.destroy();
  }

  componentDidUpdate() {
    if (this.getValue() !== this.prepareText(this.props.children)) {
      this.mediumEditor.setContent(this.prepareText(this.props.children));
    }
  }

  getValue() {
    return this.element.innerHTML;
  }

  getCurrentLineElement() {
    return MediumEditor.selection.getSelectionStart(
      this.mediumEditor.options.ownerDocument
    );
  }

  getPreviousLineElement() {
    const currentElement = this.getCurrentLineElement();
    const { util } = MediumEditor;

    let previousSibling = util.findPreviousSibling(currentElement);
    while (previousSibling && !util.isElement(previousSibling)) {
      previousSibling = util.findPreviousSibling(previousSibling);
    }

    return previousSibling;
  }

  refElement = element => {
    this.element = element;
  };

  isEmpty() {
    return isWysiwygValueEmpty(this.getValue());
  }

  isLineEmpty(node) {
    const strippedValue = stripTagsAndTrim(node.innerHTML);
    return !strippedValue;
  }

  isCaretAtStartOfLine() {
    const currentElement = this.getCurrentLineElement();
    const caretPositions =
      MediumEditor.selection.getCaretOffsets(currentElement);

    return caretPositions.left === 0;
  }

  prepareText(text) {
    return wrapInsideHtmlParagraph(text);
  }

  render() {
    return <div className='wysiwyg' ref={this.refElement} />;
  }
}
