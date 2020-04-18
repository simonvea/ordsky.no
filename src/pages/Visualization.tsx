import React from 'react';
import { useHistory, useRouteMatch, Switch, Route } from 'react-router-dom';
import { useCloudContext } from '../context/cloud/cloudContext.hook';
import { Spinner } from '../components/Spinner';
import { Charts } from '../components/Charts';
import { WordCloud } from '../components/Cloud';

export const Visualization: React.FC = function Visualization() {
  const {
    state: { cloud, error, loading },
  } = useCloudContext();
  const history = useHistory();
  const { path } = useRouteMatch();

  if (loading) {
    return <Spinner message="Lager ordsky..." />;
  }

  if (error) {
    return (
      <div>
        <p>En error har hendt: {error} </p>
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

  if (!cloud) {
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

  return (
    <div>
      <Switch>
        <Route exact path={path}>
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
        </Route>
        <Route path={`${path}/text`}>
          <WordCloud />
          <Charts />
        </Route>
        <Route path={`${path}/words`}>
          <WordCloud />
        </Route>
      </Switch>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Visualization;
