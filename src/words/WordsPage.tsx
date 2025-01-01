import React from 'react';
import { useCloud } from '../common/hooks';
import { WordsForm } from './WordsForm';
import { Spinner } from '../common/molecules/Spinner';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { useCallToAction } from '../common/hooks/useCallToAction';

export type WordsPageProps = {};

export const WordsPage: React.FC<WordsPageProps> = function WordsPage() {
  const {
    state: { loading, error, cloud },
    actions: { createCloudFromWords, reset },
  } = useCloud();

  const { shouldDisplayCallToAction } = useCallToAction();

  if (loading) {
    return <Spinner message="Lager ordsky..." />;
  }

  if (error) {
    const errorMessage = `Noe har gått galt: ${error}`;

    return <ErrorScreen message={errorMessage} onReset={reset} />;
  }

  if (cloud) {
    return (
      <CloudDisplay
        cloud={cloud}
        onRestart={reset}
        restartText="Lag en ny ordsky"
        shouldDisplayCallToAction={shouldDisplayCallToAction}
      />
    );
  }

  return <WordsForm onSubmit={createCloudFromWords} />;
};
