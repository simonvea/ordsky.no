import React from 'react';
import { useCloud } from '../common/hooks/useCloud';
import { Spinner } from '../common/molecules/Spinner';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { TextForm } from './TextForm';

export type TextPageProps = {
  onClickToWordsForm: () => void;
};

export const TextPage: React.FC<TextPageProps> = function TextPage({
  onClickToWordsForm,
}) {
  const {
    state: { loading, error, cloud, wordCount },
    actions: { createCloudFromText, reset },
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
        wordCount={wordCount}
        cloud={cloud}
        onRestart={reset}
        restartText="Lag en ny ordsky"
      />
    );
  }

  return (
    <TextForm
      onSubmit={createCloudFromText}
      onClickWords={onClickToWordsForm}
      loading={loading}
    />
  );
};
