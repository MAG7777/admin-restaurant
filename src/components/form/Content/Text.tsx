import React from 'react';

import { pick } from 'utils/helpers';

import { Wysiwyg } from './Wysiwyg';

type TProps = {
  value: any;
  onChange: (value: any) => any;
  onCaretInsideText: () => any;
  onCaretNearEmptyLine: (position: number, node: React.ReactNode) => void;
  errorRef: any;
  placeholder: string;
};

export class TextFormContent extends React.Component<TProps> {
  static displayName = 'FormContent:Text';

  static defaultProps = {
    placeholder: '',
  };
  wysiwyg: any;

  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  onChange = text => {
    this.props.onChange(text);
  };

  onCaretPositionChange = () => {
    const wysiwyg = this.wysiwyg;
    let node;

    if (!wysiwyg.isCaretAtStartOfLine()) {
      this.props.onCaretInsideText();
      return;
    }

    const currentElement = wysiwyg.getCurrentLineElement();
    const previousElement = wysiwyg.getPreviousLineElement();

    if (wysiwyg.isLineEmpty(currentElement)) {
      node = currentElement;
    } else if (previousElement && wysiwyg.isLineEmpty(previousElement)) {
      node = previousElement;
    }

    if (node) {
      const position = pick(node.getBoundingClientRect(), 'top');
      this.props.onCaretNearEmptyLine(position, node);
    } else {
      this.props.onCaretInsideText();
    }
  };

  refWysiwyg = wysiwyg => {
    this.wysiwyg = wysiwyg;
  };

  splitText(node) {
    const { wysiwyg } = this;
    const texts = [];
    const children = Array.prototype.slice.call(wysiwyg.element.children);

    node = node || wysiwyg.getCurrentLineElement();

    let childIndex = children.findIndex(child => child === node);

    childIndex = childIndex === -1 ? children.length : childIndex;

    texts.push(children.slice(0, childIndex), children.slice(childIndex + 1));

    return texts.map(text =>
      text.reduce((memo, element) => memo + element.outerHTML, '')
    );
  }

  render() {
    return (
      <div
        className='content_text ant-content_text'
        ref={this.props.errorRef}
        tabIndex={0}
      >
        <Wysiwyg
          ref={this.refWysiwyg}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          onCaretPositionChange={this.onCaretPositionChange}
        >
          {this.props.value}
        </Wysiwyg>
      </div>
    );
  }
}
