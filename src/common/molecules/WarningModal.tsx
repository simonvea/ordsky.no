import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/Button';
import { Form } from '../atoms/Form';

const Dialog = styled.dialog`
  padding: 2rem;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Message = styled.p`
  margin: 0 0 1.5rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled(Button)`
  background: none;
  color: inherit;
  border: 1px solid #e2e8f0;

  &:hover {
    background-color: #f7fafc;
    box-shadow: none;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #e53e3e;

  &:hover {
    background-color: #c53030;
  }
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
          <CancelButton type="submit" value="cancel" $small autoFocus>
            Avbryt
          </CancelButton>
          <ConfirmButton type="submit" value="confirm" $small>
            Avslutt
          </ConfirmButton>
        </ButtonContainer>
      </Form>
    </Dialog>
  );
}
