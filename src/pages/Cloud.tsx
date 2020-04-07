import React from 'react';
import './Cloud.css';
import {
  createCloud,
  svgDataURL,
  downloadAsPng,
  Cloud,
} from '../utils/svgToPng';

export interface CloudProps {
  cloud: Cloud[];
  toggleDisplay: () => void;
}

export const WordCloud: React.FC<CloudProps> = function WordCloud({
  cloud,
  toggleDisplay,
}) {
  const svg = createCloud(cloud);
  const xml = svgDataURL(svg);
  const download = (): void => downloadAsPng(xml);

  return (
    <div>
      <section className="ordsky">
        <img src={xml} alt="ordsky" className="ordsky__img" />
      </section>
      <div className="flex-container">
        <button
          type="button"
          onClick={download}
          className="button button--secondary"
        >
          Last ned som png
        </button>
        <button type="button" onClick={toggleDisplay} className="button">
          Ny ordsky
        </button>
      </div>
    </div>
  );
};
