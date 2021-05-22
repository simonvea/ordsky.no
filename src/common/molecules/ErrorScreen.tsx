import React from 'react';
import { Button } from '../atoms/Button';
import { Column } from '../atoms/Column';

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
    <Column>
      <p>{message || genericMessage}</p>
      <Button type="button" onClick={onReset}>
        Prøv igjen
      </Button>
    </Column>
  );
};
