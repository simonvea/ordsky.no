import React, { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { Button, IconButton } from "../../../common/atoms/Button";
import { Title } from "../../../common/atoms/Title";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiError, getSession } from "../services/CollectService";
import { CopyLinkField } from "../../../common/molecules/CopyLinkField";

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  width: 100%;
  max-width: 560px;
`;

const CenteredTitle = styled(Title)`
  text-align: center;
`;

const Card = styled.section<{ $emphasis?: boolean }>`
  padding: 1.25rem 1.5rem;
  background-color: ${(props) =>
    props.$emphasis
      ? "var(--surface-container-high)"
      : "var(--surface-container)"};
  border: 1px solid var(--outline-variant);
  border-radius: 16px;

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }

  p {
    color: var(--on-surface-variant);
    margin: 0 0 1rem;
  }
`;

const Count = styled.p`
  && {
    font-size: 1.25rem;
    color: var(--text-color-primary);
    margin: 0 0 0.25rem;
  }
`;

const RefreshLine = styled.p`
  && {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    margin: 0;
  }
`;

const WaitScreenActionsContainer = styled.section`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
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
      <CenteredTitle>Innsamling</CenteredTitle>

      <Card>
        <h2>1. Del lenken med deltakerne</h2>
        <p>De kan sende inn ord når det passer dem.</p>
        <CopyLinkField link={linkToJoin} label="Kopier lenke" />
      </Card>

      <Card $emphasis>
        <h2>2. Ta vare på admin-lenken</h2>
        <p>
          Bare du kan lage ordskyen. For å komme tilbake senere{" "}
          <em>må</em> du ha denne lenken, så lagre den et trygt
          sted.
        </p>
        <CopyLinkField
          link={linkToJoin + "?admin=true"}
          label="Kopier admin-lenke"
          variant="tonal"
        />
      </Card>

      <Card>
        <h2>3. Lag ordskyen når alle har svart</h2>
        <Count role="status">
          {hasEntries
            ? `${numberOfEntries} har lagt inn ord.`
            : "Ingen har lagt inn ord ennå."}
        </Count>
        <RefreshLine>
          {fetchingNumberOfEntries
            ? "Sjekker for nye ord..."
            : `Sjekker igjen om ${countDownSeconds} sekunder`}
          <IconButton
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
          </IconButton>
        </RefreshLine>
        <WaitScreenActionsContainer>
          <Button type="button" $variant="text" onClick={onQuit}>
            Avslutt
          </Button>
          <Button
            type="button"
            onClick={onCreateWordCloud}
            disabled={!hasEntries || loading}
          >
            Lag ordsky
          </Button>
        </WaitScreenActionsContainer>
      </Card>
    </Container>
  );
}
