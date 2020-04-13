import React from 'react';
import './Cloud.css';
import { useHistory } from 'react-router-dom';
import { svgDataURL, downloadAsPng } from '../utils/downloadAsPng';
import { createCloud } from '../utils/cloud/createCloud';
import { useCloudContext } from '../context/cloud/cloudContext.hook';
import { Spinner } from '../components/Spinner';

export const WordCloud: React.FC = function WordCloud() {
  const { state } = useCloudContext();
  const history = useHistory();

  if (state.loading) {
    return <Spinner message="Lager ordsky..." />;
  }

  if (state.error) {
    return (
      <div>
        <p>En error har hendt: {state.error} </p>
        <button
          type="button"
          className="button"
          onClick={() => history.goBack()}
        >
          Tilbake
        </button>
      </div>
    );
  }

  if (!state.cloud) {
    return (
      <div className="flex-container flex-container--column">
        <p>Mangler ordsky.</p>
        <button
          type="button"
          className="button"
          onClick={() => history.push('/')}
        >
          Gå til forsiden
        </button>
      </div>
    );
  }

  const svg = createCloud(state.cloud);
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
          Last ned
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
};

// eslint-disable-next-line import/no-default-export
export default WordCloud;
