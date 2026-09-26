import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../../common/atoms/Button';
import { Title } from '../../../common/atoms/Title';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 420px;
  text-align: center;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 3rem;
  color: var(--secondary-color-light);
`;

const ActionsContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Message = styled.p`
  color: var(--on-surface-variant);
`;

export type Props = {
  onAddMoreWords: () => void;
  onQuit: () => void;
};

export const SubmittedWords: React.FC<Props> = ({ onAddMoreWords, onQuit }) => {
  return (
    <Container>
      <Icon icon={faCircleCheck} aria-hidden="true" />
      <Title>Ordene er sendt inn!</Title>
      <Message>
        Takk for bidraget. Den som startet innsamlingen lager ordskyen når alle
        har svart.
      </Message>
      <ActionsContainer>
        <Button $variant="text" onClick={onQuit}>
          Avslutt
        </Button>
        <Button $variant="tonal" onClick={onAddMoreWords}>
          Legg til flere ord
        </Button>
      </ActionsContainer>
    </Container>
  );
};
