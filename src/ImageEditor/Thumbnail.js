import React from 'react';
import PropTypes from 'prop-types';

import { ImageEditorContext } from './ImageEditor';

export default class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragStartX: 0,
      dragStartY: 0,
    };

    this.pipWrapper = React.createRef();

    // create empty drag image
    this.dragImg = new Image(0, 0);
    this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    this.drag = this.drag.bind(this);
    this.dragStart = this.dragStart.bind(this);
  }

  getClientX(event) {
    return event.clientX - this.pipWrapper.current.getBoundingClientRect().left;
  }

  getClientY(event) {
    return event.clientY - this.pipWrapper.current.getBoundingClientRect().top;
  }

  dragStart(event, imageState) {
    event.dataTransfer.setDragImage(this.dragImg, 0, 0);
    imageState.setActiveDrag('thumbnail');
  }

  drag(event, imageState) {
    if (imageState.activeDrag !== 'thumbnail') return;

    const {
      left, right, top, bottom,
    } = this.pipWrapper.current.getBoundingClientRect();
    const xBox = (right - left);
    const yBox = (bottom - top);
    const positionX = (((event.clientX - left) / xBox) * 100);
    const positionY = (((event.clientY - top) / yBox) * 100);

    imageState.setPositionX(positionX);
    imageState.setPositionY(positionY);
  }

  render() {
    const { image, height, width } = this.props;

    return (
      <ImageEditorContext.Consumer>
        {(imageState) => {
          const {
            backgroundPositionX,
            backgroundPositionY,
            backgroundSize,
          } = imageState;

          const pipHeight = (height / 8);
          const pipWidth = (width / 8);

          const pipFocusSize = ((100 / backgroundSize) * 100);
          const pipWrapperSize = (100 - pipFocusSize);

          const pipFocusTop = pipFocusSize < 100 ? ((backgroundPositionY * (pipWrapperSize / 100))) : 0;
          const pipFocusLeft = pipFocusSize < 100 ? ((backgroundPositionX * (pipWrapperSize / 100))) : 0;

          return (
            <React.Fragment>
              <div
                className="pip"
                ref={this.pipWrapper}
                onDragStart={e => this.dragStart(e, imageState)}
                onDragOver={e => this.drag(e, imageState)}
                draggable
              >
                <div className="pip-focus" />
              </div>

              <style jsx>{`
                .pip {
                  background: url(${image}) no-repeat;
                  background-size: contain;
                  border: 1px solid white;
                  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
                  height: ${pipHeight}px;
                  width: ${pipWidth}px;
                  position: absolute;
                  bottom: 10px;
                  right: 10px;
                  z-index: 100;
                }
    
                .pip-focus {
                  position: absolute;
                }
              `}</style>

              <style jsx>{`
                .pip-focus {
                  border: ${pipFocusSize < 99.9 ? 1 : 0}px solid red;
                  height: ${pipFocusSize}%;
                  width: ${pipFocusSize}%;
                  top: ${pipFocusTop}%;
                  left: ${pipFocusLeft}%
                }
              `}</style>
            </React.Fragment>
          );
        }}

      </ImageEditorContext.Consumer>
    );
  }
}

Thumbnail.propTypes = {
  image: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};
