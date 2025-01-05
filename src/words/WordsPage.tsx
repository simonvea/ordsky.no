import React from 'react';
import { useCloud } from '../common/hooks';
import { WordsForm } from './WordsForm';
import { Spinner } from '../common/molecules/Spinner';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { useCallToAction } from '../common/hooks/useCallToAction';
import styled from 'styled-components';
import { BackButton } from '../common/atoms/BackButton';

export type WordsPageProps = {};

const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

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

  return (
    <MainContainer>
      <BackButton />
      {cloud ? (
        <CloudDisplay
          cloud={cloud}
          onRestart={reset}
          restartText="Lag en ny ordsky"
          shouldDisplayCallToAction={shouldDisplayCallToAction}
        />
      ) : (
        <WordsForm onSubmit={createCloudFromWords} />
      )}
    </MainContainer>
  );
};
