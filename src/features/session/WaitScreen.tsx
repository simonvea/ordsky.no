import React from 'react';
import styled from 'styled-components';
import { Button, SecondaryButton } from '../../components/atoms/Button';
import { Title } from '../../components/atoms/Title';

export type WaitScreenProps = {
  isAdmin?: boolean;
  numberOfEntries: number;
  onCreateWordCloud: () => void;
  onQuit: () => void;
  id: string;
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
  id,
}) => {
  const hasEntries = numberOfEntries > 0;

  return (
    <>
      <Title>Kode: {id.toUpperCase()}</Title>
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
        <SecondaryButton type="button" onClick={onQuit}>
          Avslutt{' '}
        </SecondaryButton>
      </WaitScreenActionsContainer>
    </>
  );
};
