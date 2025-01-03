import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button, SecondaryButton } from '../../../common/atoms/Button';
import { TextContainer } from '../../../common/atoms/TextContainer';
import { Title } from '../../../common/atoms/Title';
import { Spinner } from '../../../common/molecules/Spinner';

export type WaitScreenProps = {
  isAdmin?: boolean;
  numberOfEntries: number;
  onCreateWordCloud: () => void;
  onQuit: () => void;
  id: string;
  loading?: boolean;
};

const WaitScreenActionsContainer = styled.section`
  display: flex;
  margin-top: 1.5rem;
`;

const preventClose = (e: BeforeUnloadEvent): string => {
  e.preventDefault();

  const message = 'Om du forlater siden så får du ikke laget ordskyen.';

  // Support legacy browsers
  e.returnValue = message;

  return message;
};

export function WaitScreen({
  numberOfEntries,
  isAdmin,
  onCreateWordCloud,
  onQuit,
  id,
  loading,
}: WaitScreenProps): React.ReactElement {
  const hasEntries = numberOfEntries > 0;

  // TODO: Also add warning on quit if there are entries
  useEffect(() => {
    if (isAdmin && hasEntries) {
      window.addEventListener('beforeunload', preventClose);
    }

    return () => window.removeEventListener('beforeunload', preventClose);
  }, [isAdmin, hasEntries]);

  return (
    <>
      {isAdmin && (
        <TextContainer>
          <p>Del denne koden med de du ønsker å lage en ordsky sammen med.</p>
          <p>
            Når de som skal legge inn ord har lagt inn ord, kan du trykke på
            &quot;Lag ordsky&quot; for å lage en ordsky av alle ordene som er
            lagt inn.
          </p>
          <p>
            Obs! Det er bare du som kan lage ordsky. Det betyr at om du forlater
            denne siden så vil det ikke være mulig å lage en ordsky av ordene
            som er lagt inn.
          </p>
        </TextContainer>
      )}
      <Title>Kode: {id}</Title>
      {hasEntries ? (
        <span>{`${numberOfEntries} har lagt inn ord.`}</span>
      ) : (
        <p>Venter på ord.</p>
      )}
      {loading && <Spinner message="Lager ordsky..." />}
      <WaitScreenActionsContainer>
        {isAdmin && (
          <Button
            type="button"
            onClick={onCreateWordCloud}
            disabled={!hasEntries || loading}
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
}
