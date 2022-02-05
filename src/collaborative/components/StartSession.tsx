import React from "react";
import styled from "styled-components";
import { Button } from "../../common/atoms/Button";
import { Form } from "../../common/atoms/Form";
import { Input } from "../../common/atoms/Input";
import { Label } from "../../common/atoms/Label";
import { Title } from "../../common/atoms/Title";

const JoinSessionForm = styled(Form)`
  justify-content: space-around;
  height: 160px;
`;

const StartSessionActionsContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 480px;
`;

const SessionInfoContainer = styled.section`
  max-width: 480px;
  margin-bottom: 3rem;

  p {
    font-size: 1.125rem;
    line-height: 1.5625rem;
    width: calc(100% - 40px);
    max-width: 600px;
    text-rendering: optimizeLegibility;
  }
`;

const StartSessionContainer = styled.section`
  min-height: 80vh;
`;

export type StartSessionProps = {
  onNewSession: () => void;
  onJoinSession: (id: string) => void;
};

export function StartSession({
  onNewSession,
  onJoinSession,
}: StartSessionProps): React.ReactElement {
  const [idToJoin, setIdToJoin] = React.useState("");

  const joinSession = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onJoinSession(idToJoin);
  };

  return (
    <StartSessionContainer>
      <Title>Felles ordsky</Title>
      <SessionInfoContainer>
        <p>På denne siden kan du skape en felles ordsky.</p>
        <p>
          For å starte en ny felles økt, trykk på &quot;Start en ny økt.&quot;
          Du vil da bli satt som administrator for denne økten. Det vil si at
          det er du som er ansvarlig for å trykke &quot;Lag ordsky&quot; når
          alle har sendt inn sine ord.
        </p>
        <p>
          For å bli med i en økt som noen andre har startet, skriv inn den
          fem-sifrede koden i feltet under. Trykk så &quot;Bli med i en
          økt&quot;.
        </p>
      </SessionInfoContainer>
      <StartSessionActionsContainer>
        <div>
          <Button
            type="button"
            onClick={onNewSession}
            data-testid="start-session-btn"
          >
            Start en ny økt
          </Button>
        </div>

        <JoinSessionForm onSubmit={joinSession}>
          <Label htmlFor="idInput">
            Skriv inn en id:
            <Input
              value={idToJoin}
              onChange={({ target }) => setIdToJoin(target.value)}
              id="idInput"
            />
          </Label>
          <Button
            type="submit"
            disabled={idToJoin.length < 5}
            data-testid="join-session-btn"
          >
            Bli med i en økt
          </Button>
        </JoinSessionForm>
      </StartSessionActionsContainer>
    </StartSessionContainer>
  );
}
