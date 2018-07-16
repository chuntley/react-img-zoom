import React from 'react';
import PropTypes from 'prop-types';

import Thumbnail from './Thumbnail';

export const ImageEditorContext = React.createContext();

export default class ImageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: 1,
      contrast: 1,
      backgroundSize: 100,
      backgroundPositionX: 50,
      backgroundPositionY: 50,
      dragStartX: 0,
      dragStartY: 0,
      activeDrag: '',
      setActiveDrag: activeDrag => this.setState({ activeDrag }),
      setPositionX: backgroundPositionX => this.setState({ backgroundPositionX }),
      setPositionY: backgroundPositionY => this.setState({ backgroundPositionY }),
      movePositionX: diff => this.setState(state => ({ backgroundPositionX: (state.backgroundPositionX + (diff * (100 / state.backgroundSize))) })),
      movePositionY: diff => this.setState(state => ({ backgroundPositionY: (state.backgroundPositionY + (diff * (100 / state.backgroundSize))) })),
      zoomIn: speed => this.setState(state => ({ backgroundSize: state.backgroundSize + (speed * (state.backgroundSize / 100)) })),
      zoomOut: (speed) => {
        const newBackgroundSize = this.state.backgroundSize - (speed * (this.state.backgroundSize / 100));
        if (newBackgroundSize >= 100) this.setState({ backgroundSize: newBackgroundSize });
        else this.setState({ backgroundSize: 100 });
      },
      brightnessUp: diff => this.setState(state => ({ brightness: state.brightness + diff })),
      brightnessDown: diff => this.setState(state => ({ brightness: state.brightness - diff })),
      setBrightness: brightness => this.setState({ brightness }),
      contrastUp: diff => this.setState(state => ({ contrast: state.contrast + diff })),
      contrastDown: diff => this.setState(state => ({ contrast: state.contrast - diff })),
      setContrast: contrast => this.setState({ contrast }),
    };

    // create empty drag image
    this.dragImg = new Image(0, 0);
    this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    this.drag = this.drag.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.wheel = this.wheel.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.setState((() => ({ backgroundSize: 100.1 })));
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  getClientX(event) {
    return event.clientX - event.target.getBoundingClientRect().left;
  }

  getClientY(event) {
    return event.clientY - event.target.getBoundingClientRect().top;
  }

  dragStart(event) {
    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);
    event.dataTransfer.setDragImage(this.dragImg, 0, 0);

    this.state.setActiveDrag('main');
    this.setState({ dragStartX: clientX });
    this.setState({ dragStartY: clientY });
  }

  drag(event) {
    if (this.state.activeDrag !== 'main') return;

    const dragSpeed = (0.04 * this.props.dragAdjust);
    this.setDragX(event, dragSpeed);
    this.setDragY(event, dragSpeed);
  }

  setDragX(event, dragSpeed) {
    const clientX = this.getClientX(event);
    const { width } = this.props;

    const dragStartXPosition = ((this.state.dragStartX / width) * 100);
    const clientXPosition = ((clientX / width) * 100);
    const diffX = ((dragStartXPosition - clientXPosition) * dragSpeed);

    if ((this.state.backgroundPositionX + diffX) > 0 && (this.state.backgroundPositionX + diffX) < 100) {
      this.state.movePositionX(diffX);
    }
  }

  setDragY(event, dragSpeed) {
    const clientY = this.getClientY(event);
    const { height } = this.props;

    const dragStartYPosition = ((this.state.dragStartY / height) * 100);
    const clientYPosition = ((clientY / height) * 100);
    const diffY = ((dragStartYPosition - clientYPosition) * dragSpeed);

    if ((this.state.backgroundPositionY + diffY) > 0 && (this.state.backgroundPositionY + diffY) < 100) {
      this.state.movePositionY(diffY);
    }
  }

  wheel(event) {
    const { deltaY } = event;
    const { height, width } = this.props;
    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);
    const zoomSpeed = (3 * this.props.zoomAdjust);

    // set initial zoom position
    if (this.state.backgroundSize === 100) {
      this.state.setPositionX(((clientX / width) * 100));
      this.state.setPositionY(((clientY / height) * 100));
    }

    if (deltaY > 0) this.state.zoomIn(zoomSpeed);
    if (deltaY < 0 && this.state.backgroundSize > 100) this.state.zoomOut(zoomSpeed);
  }

  onKeyDown(event) {
    const zoomSpeed = (20 * this.props.zoomAdjust);
    const brightnessStep = (0.05 * this.props.brightnessAdjust);
    const contrastStep = (0.05 * this.props.contrastAdjust);
    const dragSpeed = (5 * this.props.dragAdjust);

    if (event.key === 'ArrowUp' && !event.altKey && !event.shiftKey) this.state.zoomIn(zoomSpeed);
    if (event.key === 'ArrowDown' && !event.altKey && !event.shiftKey) this.state.zoomOut(zoomSpeed);

    if (event.key === 'ArrowUp' && event.altKey && !event.shiftKey) this.state.brightnessUp(brightnessStep);
    if (event.key === 'ArrowDown' && event.altKey && !event.shiftKey) this.state.brightnessDown(brightnessStep);

    if (event.key === 'ArrowUp' && !event.altKey && event.shiftKey) this.state.contrastUp(contrastStep);
    if (event.key === 'ArrowDown' && !event.altKey && event.shiftKey) this.state.contrastDown(contrastStep);

    if (event.key === 'ArrowUp' && event.altKey && event.shiftKey) this.state.movePositionY(-dragSpeed);
    if (event.key === 'ArrowDown' && event.altKey && event.shiftKey) this.state.movePositionY(dragSpeed);
    if (event.key === 'ArrowLeft' && event.altKey && event.shiftKey) this.state.movePositionX(-dragSpeed);
    if (event.key === 'ArrowRight' && event.altKey && event.shiftKey) this.state.movePositionX(dragSpeed);
  }

  render() {
    const { image, height, width } = this.props;
    const {
      backgroundPositionX,
      backgroundPositionY,
      backgroundSize,
      brightness,
      contrast,
    } = this.state;

    return (
      <ImageEditorContext.Provider value={this.state}>
        <div className="container">
          <div
            className="image"
            onDragStart={e => this.dragStart(e)}
            onDragOver={e => this.drag(e)}
            onWheel={e => this.wheel(e)}
            onKeyDown={e => this.keyPress(e)}
            draggable
          />
          <Thumbnail
            image={image}
            height={height}
            width={width}
          />

          <style jsx>{`
            .container {
              height: ${height}px;
              width: ${width}px;
              position: relative;
            }

            .image {
              background: url(${image}) no-repeat;
              height: ${height}px;
              width: ${width}px;
              position: relative;
            }
          `}</style>

          <style jsx>{`
            .image {
              background-position: ${backgroundPositionX}% ${backgroundPositionY}%;
              background-size: ${backgroundSize}% ${backgroundSize}%;
              filter: brightness(${brightness}) contrast(${contrast});
            }
          `}</style>
        </div>
      </ImageEditorContext.Provider>
    );
  }
}

ImageEditor.defaultProps = {
  zoomAdjust: 1,
  dragAdjust: 1,
  brightnessAdjust: 1,
  contrastAdjust: 1,
};

ImageEditor.propTypes = {
  image: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  zoomAdjust: PropTypes.number,
  dragAdjust: PropTypes.number,
  brightnessAdjust: PropTypes.number,
  contrastAdjust: PropTypes.number,
};
