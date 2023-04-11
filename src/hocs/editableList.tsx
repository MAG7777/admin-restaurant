import React from 'react';

import { omit } from 'utils/helpers';

function removeAt(array, index) {
  const newArr = [...array];
  newArr.splice(index, 1);

  return newArr;
}

type TProps = {
  value: any[];
  maxLength?: number;
  innerRef?: any;
  onChange: (value: any) => void;
  [key: string]: any;
};

export default WrappedComponent => {
  class Component extends React.Component<TProps> {
    static defaultProps = {
      onChange: () => undefined,
      innerRef: () => undefined,
      maxLength: undefined,
    };
    options = [];

    componentDidMount() {
      this.options = [...Array(this.props.value.length).keys()].map(id => ({
        id,
      }));
    }

    getItems = () =>
      this.props.value.map((item, index) => {
        return { ...this.options[index], ...item };
      });

    getItem = index => this.props.value[index];

    getNewOptions = (items, options = []) => {
      const nextId = this.options.length
        ? this.options.reduce((acc, item) => {
            if (item.id > acc) {
              acc = item.id;
            }
            return acc;
          }, 0) + 1
        : 0;

      options = Array.isArray(options) ? options : [options];

      return [
        ...Array((Array.isArray(items) ? items.length : 1) + nextId).keys(),
      ]
        .map(k => k + nextId)
        .map((id, index) => ({ id, ...options[index] }));
    };

    addItems = (items, options) => {
      if (this.props.maxLength) {
        items = items.slice(0, this.props.maxLength - this.options.length);
      }

      this.options = this.options.concat(this.getNewOptions(items, options));

      this.changeValue(this.props.value.concat(items));
    };

    resetItems = (items = [], options = []) => {
      if (this.props.maxLength) {
        items = items.slice(0, this.props.maxLength);
      }

      this.options = this.getNewOptions(items, options);
      this.changeValue(items.map(elem => omit(elem, ['id', 'uid'])));
    };

    removeAt = index => {
      this.options = removeAt(this.options, index);

      this.changeValue(removeAt(this.props.value, index));
    };

    changeItem = (index, value, option) => {
      this.options[index] = { ...this.options[index], ...option };

      const items = [...this.props.value];

      items[index] = value;

      this.changeValue(items);
    };

    changeValue = value => {
      this.props.onChange(value);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          ref={this.props.innerRef}
          getItems={this.getItems}
          getItem={this.getItem}
          addItems={this.addItems}
          removeAt={this.removeAt}
          resetItems={this.resetItems}
          changeItem={this.changeItem}
        />
      );
    }
  }

  return Component;
};
