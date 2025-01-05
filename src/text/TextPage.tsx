import React from 'react';
import styled from 'styled-components';
import { useCloud } from '../common/hooks/useCloud';
import { Spinner } from '../common/molecules/Spinner';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { TextForm } from './components/TextForm';
import { useCallToAction } from '../common/hooks/useCallToAction';
import { BackButton } from '../common/atoms/BackButton';

export type TextPageProps = {};

const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

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

  return (
    <MainContainer>
      <BackButton />
      {cloud ? (
        <CloudDisplay
          cloud={cloud}
          onRestart={reset}
          wordCount={wordCount?.slice(0, 10)}
          restartText="Lag en ny ordsky"
          shouldDisplayCallToAction={shouldDisplayCallToAction}
        />
      ) : (
        <TextForm
          onSubmit={(text, filter) => createCloudFromText(text, filter)}
          loading={loading}
        />
      )}
    </MainContainer>
  );
};
