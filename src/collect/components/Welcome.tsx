import React from 'react';
import styled from 'styled-components';
import { Button } from '../../common/atoms/Button';
import { Form } from '../../common/atoms/Form';
import { Title } from '../../common/atoms/Title';

const JoinSessionForm = styled(Form)`
  justify-content: space-around;
  height: 160px;
`;

const StartSessionActionsContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export type WelcomeProps = {
  onNewSession: () => void;
};

export function Welcome({ onNewSession }: WelcomeProps): React.ReactElement {
  return (
    <StartSessionContainer>
      <Title>Felles ordsky</Title>
      <SessionInfoContainer>
        <p>
          På denne siden kan du skape en ordsky basert på ord andre sender inn.
        </p>
        <p>
          For å starte en økt, trykk på &quot;Start en ny økt.&quot; Du vil da
          bli satt som administrator for denne økten. Det vil si at det er du
          som er ansvarlig for å trykke &quot;Lag ordsky&quot; når alle har
          sendt inn sine ord.
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
      </StartSessionActionsContainer>
    </StartSessionContainer>
  );
}
