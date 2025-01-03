import React, { ReactElement, use, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, SecondaryButton } from '../../../common/atoms/Button';
import { TextContainer } from '../../../common/atoms/TextContainer';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSession } from '../services/CollectService';
import { InfoBox } from '../../../common/atoms/InfoBox';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CopyLinkButton = styled.button`
  display: inline;
  font-size: 1rem;
  padding: 0;
  background-color: transparent;
  color: #1e90ff;
  border: none;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #63a4ff;
  }

  &.active {
    color: #87cefa;
  }
`;

const CopyLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const CopiedNotification = styled.div`
  margin: 1rem;
  height: 1rem;
`;

const Emphasis = styled.em`
  font-style: italic;
`;

const WaitScreenActionsContainer = styled.section`
  display: flex;
  margin-top: 1.5rem;
`;

export type WaitScreenProps = {
  id: string;
  initialEntries: number;
  onCreateWordCloud: () => void;
  onQuit: () => void;
  loading: boolean;
};

export function WaitScreen({
  id,
  initialEntries,
  onCreateWordCloud,
  onQuit,
  loading,
}: WaitScreenProps): ReactElement {
  const [countDownSeconds, setCountDownSeconds] = useState<number>(60);
  const [showCopiedJoinUrlMessage, setShowCopiedJoinUrlMessage] =
    useState(false);
  const [showCopiedAdminUrlMessage, setShowCopiedAdminUrlMessage] =
    useState(false);
  const [fetchingNumberOfEntries, setFetchingNumberOfEntries] = useState(false);

  const [numberOfEntries, setNumberOfEntries] =
    useState<number>(initialEntries);

  const [copyUrlButtonText, setCopyUrlButtonText] = useState(
    'Invitér til å legge inn ord'
  );

  useEffect(() => {
    const countDownInterval = setInterval(() => {
      setCountDownSeconds((prev) => prev - 1);
    }, 1000);

    const getNumberOfEntriesInterval = setInterval(async () => {
      setFetchingNumberOfEntries(true);

      try {
        const session = await getSession(id);

        const entries = session.numberOfEntries;

        setNumberOfEntries(entries);
      } catch (error) {
        if ((error as Error).message !== '404') {
          throw error;
        }
      }

      setFetchingNumberOfEntries(false);

      setCountDownSeconds(60);
    }, 60_000);

    return () => {
      clearInterval(getNumberOfEntriesInterval);
      clearInterval(countDownInterval);
    };
  }, []);

  const hasEntries = numberOfEntries > 0;

  const linkToJoin = globalThis.location.origin + globalThis.location.pathname;

  return (
    <Container>
      <CopyLinkContainer>
        <CopiedNotification>
          {showCopiedJoinUrlMessage && <span>Kopiert link!</span>}
        </CopiedNotification>
        <Button
          $small
          onMouseEnter={() => {
            setCopyUrlButtonText(linkToJoin);
          }}
          onMouseLeave={() => {
            setCopyUrlButtonText('Invitér til å legge inn ord');
          }}
          onClick={() => {
            navigator.clipboard.writeText(linkToJoin);
            setShowCopiedJoinUrlMessage(true);
            const timeout = setTimeout(() => {
              setShowCopiedJoinUrlMessage(false);
              clearTimeout(timeout);
            }, 3000);
          }}
        >
          <FontAwesomeIcon icon={faLink} style={{ marginRight: '0.6rem' }} />
          {copyUrlButtonText}
        </Button>
      </CopyLinkContainer>

      {hasEntries ? (
        <span>{`${numberOfEntries} har lagt inn ord.`}</span>
      ) : (
        <p>Venter på ord.</p>
      )}

      {fetchingNumberOfEntries ? (
        <p>Sjekker for nye ord...</p>
      ) : (
        <p>Sjekker igjen om {countDownSeconds} sekunder</p>
      )}

      <TextContainer>
        <p>
          Når de som skal legge inn ord har lagt inn ord, kan du trykke på
          &quot;Lag ordsky&quot; for å lage en ordsky av alle ordene som er lagt
          inn.
        </p>
      </TextContainer>

      <WaitScreenActionsContainer>
        <Button
          type="button"
          onClick={onCreateWordCloud}
          disabled={!hasEntries || loading}
        >
          Lag ordsky
        </Button>
        <SecondaryButton type="button" onClick={onQuit}>
          Avslutt
        </SecondaryButton>
      </WaitScreenActionsContainer>

      <TextContainer>
        <InfoBox>
          <p>
            Obs! Det er bare du som kan lage ordskyen. For å komme tilbake
            senere for å lage ordsky, <Emphasis>må</Emphasis> du ta vare på
            linken til hvor du er nå. Det kan du ved å kopiere nettaddressen fra
            nettleseren eller kopiere den ved å trykke{' '}
            {showCopiedAdminUrlMessage ? (
              'Kopiert link!'
            ) : (
              <CopyLinkButton
                className={showCopiedAdminUrlMessage ? 'active' : ''}
                onClick={() => {
                  const url = linkToJoin + '?admin=true';
                  navigator.clipboard.writeText(url);
                  setShowCopiedAdminUrlMessage(true);
                  const timeout = setTimeout(() => {
                    setShowCopiedAdminUrlMessage(false);
                    clearTimeout(timeout);
                  }, 3000);
                }}
              >
                her.
              </CopyLinkButton>
            )}
          </p>
        </InfoBox>
      </TextContainer>
    </Container>
  );
}
