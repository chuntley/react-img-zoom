import React from 'react';
import { render } from 'react-dom';

import image from './image.jpg';
import ImageEditor from './ImageEditor/ImageEditor';

render(
  <div className="page">
    <ImageEditor
      image={image}
      height={800}
      width={1200}
      zoomAdjust={1}
      dragAdjust={1}
      brightnessAdjust={1}
    />

    <style jsx global>{`
      html {
        overflow: hidden; // prevent page bounce
      }
      .page {
        display:flex;
        align-items: center;
        justify-content: center;
      }
    `}</style>
  </div>,
  document.getElementById('app'),
);

if (module.hot) module.hot.accept();
