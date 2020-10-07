import React from 'react';
import './Cloud.css';
import { useHistory } from 'react-router-dom';
import { svgDataURL, downloadAsPng } from '../utils/downloadAsPng';
import { createCloud } from '../utils/cloud/createCloud';
import { useCloudContext } from '../context/cloud/cloudContext.hook';
import { analytics } from '../firebase';

export const WordCloud: React.FC = function WordCloud() {
  const {
    state: { cloud },
  } = useCloudContext();
  const history = useHistory();
  if (cloud) {
    const svg = createCloud(cloud);
    const xml = svgDataURL(svg);
    const download = (): void => {
      // For some reason logEvent is typed to accept a specific event...
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      analytics.logEvent('download_cloud' as any);
      downloadAsPng(xml);
    };

    return (
      <div className="flex-container flex-container--column">
        <section className="ordsky">
          <img src={xml} alt="ordsky" className="ordsky__img" />
        </section>
        <div className="flex-container">
          <button
            type="button"
            onClick={download}
            className="button button--secondary"
          >
            Last ned ordsky
          </button>
          <button
            type="button"
            onClick={() => {
              history.goBack();
            }}
            className="button"
          >
            Ny ordsky
          </button>
        </div>
      </div>
    );
  }
  return <div />;
};
