import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/atoms/Button';
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

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 560px;
  text-align: center;
`;

const CodeCard = styled.div`
  width: 100%;
  padding: 1.5rem;
  margin: 1rem 0 1.5rem;
  background-color: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: 16px;
`;

const CodeLabel = styled.p`
  margin: 0;
  color: var(--on-surface-variant);
`;

// Large enough to read from the back of a classroom when projected.
const Code = styled.p`
  margin: 0.25rem 0;
  font-size: clamp(3rem, 14vw, 5rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.15em;
  font-variant-numeric: tabular-nums;
`;

const Status = styled.p`
  font-size: 1.125rem;
  margin: 0;
`;

const Note = styled.p`
  margin: 2rem 0 0;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
`;

const WaitScreenActionsContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
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

  const joinPage = `${globalThis.location.host}/felles/live`;

  return (
    <Container>
      {isAdmin ? (
        <>
          <Title>Live-økt</Title>
          <CodeCard>
            <CodeLabel>
              Del koden med deltakerne. De går til <strong>{joinPage}</strong>{' '}
              og skriver den inn.
            </CodeLabel>
            <Code>{id.toUpperCase()}</Code>
          </CodeCard>
        </>
      ) : (
        <Title>Kode: {id.toUpperCase()}</Title>
      )}
      <Status role="status">
        {hasEntries ? `${numberOfEntries} har lagt inn ord.` : 'Venter på ord.'}
      </Status>
      {!isAdmin && (
        <Note>
          Takk, ordene dine er sendt inn. Ordskyen vises her når verten lager
          den.
        </Note>
      )}
      {loading && <Spinner message="Lager ordsky..." />}
      <WaitScreenActionsContainer>
        <Button type="button" $variant="text" onClick={onQuit}>
          Avslutt
        </Button>
        {isAdmin && (
          <Button
            type="button"
            onClick={onCreateWordCloud}
            disabled={!hasEntries || loading}
          >
            Lag ordsky
          </Button>
        )}
      </WaitScreenActionsContainer>
      {isAdmin && (
        <Note>
          Bare du kan lage ordskyen. Lukker du denne siden, kan ingen lage
          ordsky av ordene som er sendt inn.
        </Note>
      )}
    </Container>
  );
}
