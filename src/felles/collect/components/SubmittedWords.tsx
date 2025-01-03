import React from 'react';
import styled from 'styled-components';
import { Button, SecondaryButton } from '../../../common/atoms/Button';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const ActionsContainer = styled.section`
  display: flex;
  margin-top: 1.5rem;
`;

const Message = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

export type Props = {
  onAddMoreWords: () => void;
  onQuit: () => void;
};

export const SubmittedWords: React.FC<Props> = ({ onAddMoreWords, onQuit }) => {
  return (
    <Container>
      <Message>Ordene er sendt inn!</Message>
      <ActionsContainer>
        <Button onClick={onAddMoreWords}>Legg til flere ord</Button>
        <SecondaryButton onClick={onQuit}>Avslutt</SecondaryButton>
      </ActionsContainer>
    </Container>
  );
};
