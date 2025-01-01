import React, { use } from 'react';
import { useCloud } from '../common/hooks/useCloud';
import { Spinner } from '../common/molecules/Spinner';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { TextForm } from './TextForm';
import { useCallToAction } from '../common/hooks/useCallToAction';

export type TextPageProps = {};

export const TextPage: React.FC<TextPageProps> = function TextPage() {
  const {
    state: { loading, error, cloud, wordCount },
    actions: { createCloudFromText, reset },
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
        wordCount={wordCount}
        cloud={cloud}
        onRestart={reset}
        restartText="Lag en ny ordsky"
        shouldDisplayCallToAction={shouldDisplayCallToAction}
      />
    );
  }

  return <TextForm onSubmit={createCloudFromText} loading={loading} />;
};
