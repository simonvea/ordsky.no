import React from 'react';
import './Cloud.css';
import { useHistory } from 'react-router-dom';
import { svgDataURL, downloadAsPng } from '../utils/downloadAsPng';
import { createCloud } from '../utils/createCloud';
import { useWordsContext } from '../context/wordsContext.hook';
import { Spinner } from '../components/Spinner';

export const WordCloud: React.FC = function WordCloud() {
  const { state } = useWordsContext();
  const history = useHistory();

  if (state.loading) {
    return <Spinner message="Lager ordsky..." />;
  }

  if (!state.cloud) {
    return <div>Mangler ordsky.</div>;
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
          Last ned som png
        </button>
        <button
          type="button"
          onClick={() => history.push('/input')}
          className="button"
        >
          Ny ordsky
        </button>
      </div>
    </div>
  );
};
