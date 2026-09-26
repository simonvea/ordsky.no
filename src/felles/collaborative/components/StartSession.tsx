import React from 'react';
import styled from 'styled-components';
import { Button } from '../../../common/atoms/Button';
import { Input } from '../../../common/atoms/Input';
import {
  OptionsContainer,
  Option,
  OptionTitle,
} from '../../../common/atoms/Option';
import { Title as OriginalTitle } from '../../../common/atoms/Title';

const JoinSessionForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  width: 100%;
  margin-top: auto;
`;

const CodeField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--on-surface-variant);
`;

const CodeInput = styled(Input)`
  margin: 0;
  width: 9rem;
  font-size: 1.25rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  @media only screen and (min-width: 768px) {
    width: 9rem;
  }
`;

const StartSessionContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(OriginalTitle)`
  text-align: center;
`;

export type StartSessionProps = {
  onNewSession: () => void;
  onJoinSession: (id: string) => void;
};

export function StartSession({
  onNewSession,
  onJoinSession,
}: StartSessionProps): React.ReactElement {
  const [idToJoin, setIdToJoin] = React.useState('');

  const joinSession = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onJoinSession(idToJoin);
  };

  return (
    <StartSessionContainer>
      <Title>Live-økt</Title>
      <OptionsContainer>
        <Option>
          <OptionTitle>Bli med i en økt</OptionTitle>
          <p>Skriv inn koden på fem tegn som vises på skjermen til verten.</p>
          <JoinSessionForm onSubmit={joinSession}>
            <CodeField htmlFor="idInput">
              Kode
              <CodeInput
                value={idToJoin}
                onChange={({ target }) =>
                  setIdToJoin(target.value.trim().toUpperCase())
                }
                id="idInput"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={5}
              />
            </CodeField>
            <Button
              type="submit"
              disabled={idToJoin.length < 5}
              data-testid="join-session-btn"
            >
              Bli med
            </Button>
          </JoinSessionForm>
        </Option>
        <Option>
          <OptionTitle>Start en ny økt</OptionTitle>
          <p>
            Du får en kode som du deler med deltakerne. Når alle har sendt inn
            ord, trykker du «Lag ordsky», og ordskyen vises for alle. Bare du
            kan lage ordskyen, så ikke lukk siden underveis.
          </p>
          <Button
            type="button"
            $variant="tonal"
            onClick={onNewSession}
            data-testid="start-session-btn"
          >
            Start en ny økt
          </Button>
        </Option>
      </OptionsContainer>
    </StartSessionContainer>
  );
}
