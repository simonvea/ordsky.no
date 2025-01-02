import React from 'react';
import styled from 'styled-components';

type Props = {
  onAddMoreWords: () => void;
  onQuit: () => void;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const Message = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
`;

export const SubmittedWords: React.FC<Props> = ({ onAddMoreWords, onQuit }) => {
  return (
    <Container>
      <Message>Ordene er sendt inn!</Message>
      <Button onClick={onAddMoreWords}>Legg til flere ord</Button>
      <Button onClick={onQuit}>Avslutt</Button>
    </Container>
  );
};
