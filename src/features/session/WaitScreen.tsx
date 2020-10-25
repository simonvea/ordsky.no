import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button, SecondaryButton } from '../../components/atoms/Button';

export type WaitScreenProps = {
  isAdmin?: boolean;
  numberOfEntries: number;
  onCreateWordCloud: () => void;
  onQuit: () => void;
};

const WaitScreenActionsContainer = styled.section`
  display: flex;
  margin-top: 1.5rem;
`;

export const WaitScreen: React.FC<WaitScreenProps> = ({
  numberOfEntries,
  isAdmin,
  onCreateWordCloud,
  onQuit,
}) => {
  const history = useHistory();
  const hasEntries = numberOfEntries > 0;

  const handleQuit = (): void => {
    onQuit();
    history.push('/session');
  };

  return (
    <>
      {hasEntries ? (
        <span>{`${numberOfEntries} har lagt inn ord.`}</span>
      ) : (
        <p>Venter på ord.</p>
      )}
      <WaitScreenActionsContainer>
        {isAdmin && (
          <Button
            type="button"
            onClick={onCreateWordCloud}
            disabled={!hasEntries}
          >
            Lag ordsky
          </Button>
        )}
        <SecondaryButton type="button" onClick={handleQuit}>
          Avslutt{' '}
        </SecondaryButton>
      </WaitScreenActionsContainer>
    </>
  );
};
