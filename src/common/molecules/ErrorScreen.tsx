import React from 'react';
import { Button } from '../atoms/Button';
import { Column } from '../atoms/Column';

export type ErrorScreenProps = {
  message?: string;
  error: Error;
  onReset: () => void;
};

const EMAIL_BODY = `
Hei,

<Erstatt dette med en beskrivelse av hva som hendte her>

----- Feilmelding ----
LA STÅ! Dette hjelper til med å finne årsaken.

`;

const EMAIL_SUBJECT = 'Feil på ordsky.no';

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message,
  onReset,
}) => {
  const genericMessage = 'Oups, noe galt har skjedd. Beklager.';

  return (
    <Column>
      <p>{message || genericMessage}</p>
      <a
        href={`mailto:post@ordsky.no?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Send epost
      </a>
      <Button type="button" onClick={onReset}>
        Prøv igjen
      </Button>
    </Column>
  );
};
