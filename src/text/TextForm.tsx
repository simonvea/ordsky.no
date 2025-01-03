import React, { FormEvent, ChangeEvent } from 'react';
import { Button, SecondaryButton } from '../common/atoms/Button';
import { Container } from '../common/atoms/Container';
import { Form } from '../common/atoms/Form';
import { useNotification } from '../common/hooks';
import { useText } from './services/useText';
import { Alert } from '../common/atoms/Alert';
import { Textarea } from '../common/atoms/Textarea';
import { NavButton } from '../common/atoms/NavButton';

export type TextFormProps = {
  onSubmit: (text: string) => void;
  loading: boolean;
};

export const TextForm: React.FC<TextFormProps> = function TextForm({
  onSubmit,
  loading,
}) {
  const [notification, notify] = useNotification(
    'Du må legge inn tekst før du kan generere en ordsky.',
    10
  );

  const {
    state: { text },
    actions: { updateText, clearText },
  } = useText();

  const onChange = ({ target }: ChangeEvent<HTMLTextAreaElement>): void => {
    updateText(target.value);
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!text) {
      notify();
      return;
    }
    onSubmit(text);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Textarea
        name="text"
        rows={5}
        placeholder="Lim inn tekst her"
        value={text}
        onChange={onChange}
      />
      <Alert>{notification && notification}</Alert>
      <Container>
        <SecondaryButton type="button" onClick={clearText}>
          Tøm
        </SecondaryButton>
        <Button type="submit" id="submit" disabled={loading}>
          Generer ordsky
        </Button>
      </Container>
      <Container>
        <NavButton to="/words" $outline>
          Tilbake til ordskjema
        </NavButton>
      </Container>
    </Form>
  );
};
