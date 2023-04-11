import React from 'react';
import * as deepEqual from 'fast-deep-equal/es6/react';

import swipeable from 'hocs/swipeable';

import styles from './Slider.module.css';

const ANIMATION_DURATION = 500;

class BaseSlider extends React.Component {
  static defaultProps = {
    initialSlide: 0,
    onPrev: () => undefined,
    onNext: () => undefined,
    onChange: () => undefined,
    afterChange: () => undefined,
    prevDisabled: false,
    nextDisabled: false,
  };

  state = {
    items: this.props.items,
    slide: this.props.initialSlide,
    animation: null,
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    // for render items again after getting slider ref
    this.forceUpdate();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!deepEqual.default(prevState.items, nextProps.items)) {
      nextProps.onChange(nextProps.initialSlide);
      return {
        items: nextProps.items,
        slide: nextProps.initialSlide,
        animation: null,
      };
    }
    return prevState;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.forceUpdate();
  };

  prev = (params = {}) => {
    const { items, onPrev, prevDisabled } = this.props;

    if (prevDisabled) return;

    const { slide } = this.state;
    const prevSlide = (items.length + slide - 1) % items.length;

    this._slide(params, 'prev', prevSlide, onPrev);
  };

  next = (params = {}) => {
    const { items, onNext, nextDisabled } = this.props;

    if (nextDisabled) return;

    const { slide } = this.state;
    const nextSlide = (slide + 1) % items.length;

    this._slide(params, 'next', nextSlide, onNext);
  };

  goTo = (slide, params = {}) => {
    const { onChange } = this.props;

    this.setState({ slide });

    if (!params.silent) {
      onChange(slide);
    }
  };

  swipe = direction => {
    if (direction === 'left') {
      this.prev();
    } else {
      this.next();
    }
  };

  refSlider = slider => {
    this.slider = slider;
    this.props.swipeableRef(slider);
  };

  refSliderItems = sliderItems => {
    this.sliderItems = sliderItems;
  };

  renderItem = (item, index) => (
    <div
      key={`${this.props.getItemKey(item)}-${index}`}
      className={styles.item}
    >
      {this.props.renderItem(item, index)}
    </div>
  );

  _slide(params, newAnimation, newSlide, handler) {
    const { onChange, afterChange } = this.props;
    const { slide, animation } = this.state;

    if (!this.slider || animation || slide === newSlide) return;

    if (params.force) {
      this.goTo(newSlide, params);
      return;
    }

    this.setState({ animation: newAnimation });

    if (!params.silent) {
      handler();
      onChange(newSlide);
    }

    this.sliderItems.addEventListener(
      'transitionend',
      event => {
        if (
          event.target === this.sliderItems &&
          event.propertyName === 'left'
        ) {
          this.setState({ slide: newSlide, animation: null }, () => {
            if (!params.silent) {
              afterChange(newSlide);
            }
          });
        }
      },
      { once: true }
    );
  }

  renderItems() {
    const { slide } = this.state;
    let { items } = this.props;
    let newItems = [];
    if (this.slider && items.length) {
      newItems = [
        items[(items.length + slide - 1) % items.length],
        items[slide],
        items[(slide + 1) % items.length],
      ];
    } else {
      newItems = [items[0]];
    }
    return newItems.map(this.renderItem);
  }

  // for instant start of items images loading
  renderHiddenItems() {
    return this.props.items.map((item, index) =>
      this.renderItem(item, index, false)
    );
  }

  render() {
    const { animation } = this.state;
    const width = this.slider ? this.slider.offsetWidth : 0;

    return (
      <div ref={this.refSlider} className={styles.slider}>
        <div
          ref={this.refSliderItems}
          className={styles.items}
          style={{
            left: animation ? (animation === 'next' ? -2 * width : 0) : -width,
            // not animate resizing etc
            ...(animation && {
              transition: `left ${ANIMATION_DURATION}ms ease`,
            }),
          }}
        >
          {this.renderItems()}
        </div>
        <div className={styles.allItems}>{this.renderHiddenItems()}</div>
      </div>
    );
  }
}

export const Slider = swipeable({ mouseEvents: true })(BaseSlider);
