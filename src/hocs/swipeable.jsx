import React from 'react';

export default (params = {}) => {
  params = {
    discrete: true,
    mouseEvents: false,
    ...params,
  };

  const eventsHash = {
    swipeStart: ['touchstart'],
    swipeProcess: ['touchmove'],
    swipeEnd: ['touchend'],
  };

  if (params.mouseEvents) {
    eventsHash.swipeStart.push('mousedown');
    eventsHash.swipeProcess.push('mousemove');
    eventsHash.swipeEnd.push('mouseup');
  }

  return WrappedComponent => {
    class Component extends React.Component {
      static defaultProps = {
        innerRef: () => undefined,
        useSwipe: false,
      };

      componentDidMount() {
        if (!this.props.useSwipe) return;

        this.isMoved = false;

        eventsHash.swipeStart.forEach(event => {
          this.componentContent.addEventListener(event, this.onSwipeStart);
        });

        eventsHash.swipeProcess.forEach(event => {
          document.addEventListener(event, this.onSwipeProcess);
        });

        eventsHash.swipeEnd.forEach(event => {
          document.addEventListener(event, this.onSwipeEnd);
        });

        this.componentContent.addEventListener('click', this.onClick);
      }

      componentWillUnmount() {
        if (!this.props.useSwipe) return;

        eventsHash.swipeStart.forEach(event => {
          this.componentContent.removeEventListener(event, this.onSwipeStart);
        });

        eventsHash.swipeProcess.forEach(event => {
          document.removeEventListener(event, this.onSwipeProcess);
        });

        eventsHash.swipeEnd.forEach(event => {
          document.removeEventListener(event, this.onSwipeEnd);
        });

        this.componentContent.removeEventListener('click', this.onClick);
      }

      onSwipeStart = event => {
        if (!event.button || event.button === 1) {
          this.swiping = true;
          this.coords = this.getCurrentCoords(event);
        }
      };

      onSwipeProcess = event => {
        if (!this.swiping) return;

        if (event.type === 'mousemove') {
          event.preventDefault();
        }

        const newCoords = this.getCurrentCoords(event);

        const xDiff = this.coords.x - newCoords.x;
        const yDiff = this.coords.y - newCoords.y;

        if (!xDiff && !yDiff) {
          // do not handle mousemove event without diffs
          // because sometimes chrome fire move event on click
          // bug: https://bugs.chromium.org/p/chromium/issues/detail?id=161464
          return;
        }

        this.isMoved = true;

        this.coords = newCoords;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (xDiff > 0) {
            this.component.swipe('right', xDiff);
          } else {
            this.component.swipe('left', -xDiff);
          }
        }

        if (params.discrete) {
          this.onSwipeEnd();
        }
      };

      onSwipeEnd = () => {
        this.swiping = false;
        this.coords = null;

        // should exec after click event
        setTimeout(() => {
          this.isMoved = false;
        }, 0);
      };

      onClick = event => {
        if (this.isMoved) {
          event.stopPropagation();
          event.preventDefault();
        }
      };

      getCurrentCoords = event => {
        const touches = event && event.touches && event.touches[0];

        return {
          x: touches ? touches.pageX : event.clientX,
          y: touches ? touches.pageY : event.clientY,
        };
      };

      refComponentContent = el => {
        this.componentContent = el;
      };

      refComponent = el => {
        this.component = el;
        this.props.innerRef(el);
      };

      render() {
        const isWrapper = WrappedComponent.WrappedComponent;

        return (
          <WrappedComponent
            {...this.props}
            {...{ [isWrapper ? 'innerRef' : 'ref']: this.refComponent }}
            swipeableRef={this.refComponentContent}
          />
        );
      }
    }

    Component.WrappedComponent = WrappedComponent;

    return Component;
  };
};
