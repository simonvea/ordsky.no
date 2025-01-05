import React, { use } from 'react';
import { useCloud } from '../common/hooks/useCloud';
import { Spinner } from '../common/molecules/Spinner';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { TextForm } from './TextForm';
import { useCallToAction } from '../common/hooks/useCallToAction';
import styled from 'styled-components';
import { Main } from '../common/atoms/Main';
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
          restartText="Lag en ny ordsky"
          shouldDisplayCallToAction={shouldDisplayCallToAction}
        />
      ) : (
        <TextForm onSubmit={createCloudFromText} loading={loading} />
      )}
    </MainContainer>
  );
};
