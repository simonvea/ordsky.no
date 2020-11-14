import React from 'react';
import { Container } from '../../components/atoms/Container';
import { Button } from '../../components/atoms/Button';

export type ErrorScreenProps = {
  message?: string;
  onReset: () => void;
};

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message,
  onReset,
}) => {
  const genericMessage = 'Oups, noe galt har skjedd. Beklager.';

  return (
    <Container>
      <p>{message || genericMessage}</p>
      <Button type="button" onClick={onReset}>
        Start på nytt
      </Button>
    </Container>
  );
};
