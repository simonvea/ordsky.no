import React from 'react';
import { useCloud } from '../common/hooks';
import { WordsForm } from './WordsForm';
import { Spinner } from '../common/molecules/Spinner';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';

export type WordsPageProps = {
  onClickToTextForm: () => void;
};

export const WordsPage: React.FC<WordsPageProps> = function WordsPage({
  onClickToTextForm,
}) {
  const {
    state: { loading, error, cloud },
    actions: { createCloudFromWords, reset },
  } = useCloud();

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
      />
    );
  }

  return (
    <WordsForm
      onSubmit={createCloudFromWords}
      onClickText={onClickToTextForm}
    />
  );
};
