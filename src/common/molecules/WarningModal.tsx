import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/Button';
import { Form } from '../atoms/Form';

// Material 3 basic dialog on the dark surface; the browser default is white.
const Dialog = styled.dialog`
  padding: 1.5rem;
  border-radius: 28px;
  border: none;
  background-color: var(--surface-container-high);
  color: var(--text-color-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  max-width: 440px;
  width: calc(100% - 2rem);

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

const Message = styled.p`
  margin: 0 0 1.5rem 0;
  color: var(--on-surface-variant);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  width: 100%;
`;

// The destructive action is a text button in the error colour, per Material 3.
const ConfirmButton = styled(Button)`
  color: var(--error-color);
`;

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function WarningModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: WarningModalProps): React.ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    if (submitter?.getAttribute('value') === 'confirm') {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Dialog ref={dialogRef} onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button type="submit" value="cancel" $variant="text" autoFocus>
            Avbryt
          </Button>
          <ConfirmButton type="submit" value="confirm" $variant="text">
            Avslutt
          </ConfirmButton>
        </ButtonContainer>
      </Form>
    </Dialog>
  );
}
