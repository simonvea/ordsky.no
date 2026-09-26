import React, { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "../../../common/atoms/Button";
import { TextContainer } from "../../../common/atoms/TextContainer";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiError, getSession } from "../services/CollectService";
import { CopyLinkField } from "../../../common/molecules/CopyLinkField";
import { InfoBox } from "../../../common/atoms/InfoBox";

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Emphasis = styled.em`
  font-style: italic;
`;

const WaitScreenActionsContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0.3rem;
  color: inherit;
  vertical-align: middle;
  line-height: 1;

  &:hover:not(:disabled) {
    color: #1e90ff;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
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
  const [fetchingNumberOfEntries, setFetchingNumberOfEntries] = useState(false);

  const [numberOfEntries, setNumberOfEntries] =
    useState<number>(initialEntries);

  const checkEntries = async (): Promise<void> => {
    setFetchingNumberOfEntries(true);
    try {
      const session = await getSession(id);
      setNumberOfEntries(session.numberOfEntries);
    } catch (error) {
      if ((error as ApiError).response.status !== 404) {
        throw error;
      }
    }
    setFetchingNumberOfEntries(false);
    setCountDownSeconds(60);
  };

  useEffect(() => {
    const countDownInterval = setInterval(() => {
      setCountDownSeconds((prev) => prev - 1);
    }, 1000);

    const getNumberOfEntriesInterval = setInterval(checkEntries, 60_000);

    return () => {
      clearInterval(getNumberOfEntriesInterval);
      clearInterval(countDownInterval);
    };
  }, []);

  const hasEntries = numberOfEntries > 0;

  const linkToJoin = globalThis.location.origin + globalThis.location.pathname;

  return (
    <Container>
      <CopyLinkField link={linkToJoin} label="Kopier invitasjonslink" />

      {hasEntries ? (
        <span>{`${numberOfEntries} har lagt inn ord.`}</span>
      ) : (
        <p>Venter på ord.</p>
      )}

      <p>
        {fetchingNumberOfEntries
          ? "Sjekker for nye ord..."
          : `Sjekker igjen om ${countDownSeconds} sekunder`}
        <RefreshButton
          type="button"
          onClick={checkEntries}
          disabled={fetchingNumberOfEntries}
          aria-label="Sjekk nå"
          title="Sjekk nå"
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            spin={fetchingNumberOfEntries}
          />
        </RefreshButton>
      </p>

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
        <Button type="button" $variant="outlined" onClick={onQuit}>
          Avslutt
        </Button>
      </WaitScreenActionsContainer>

      <TextContainer>
        <InfoBox>
          <p>
            Obs! Det er bare du som kan lage ordskyen. For å komme tilbake
            senere for å lage ordsky, <Emphasis>må</Emphasis> du ta vare på
            linken under.
          </p>
          <CopyLinkField
            link={linkToJoin + "?admin=true"}
            label="Kopier admin-link"
          />
        </InfoBox>
      </TextContainer>
    </Container>
  );
}
