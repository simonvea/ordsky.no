import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../atoms/Button";
import { Title } from "../atoms/Title";

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  text-align: center;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2.5rem;
  color: var(--error-color);
`;

const Message = styled.p`
  color: var(--on-surface-variant);
`;

export type ErrorScreenProps = {
  message?: string;
  onReset: () => void;
};

export function ErrorScreen({
  message,
  onReset,
}: ErrorScreenProps): React.ReactElement {
  const genericMessage = "Oups, noe galt har skjedd. Beklager.";

  return (
    <Container role="alert">
      <Icon icon={faTriangleExclamation} aria-hidden="true" />
      <Title>Noe gikk galt</Title>
      <Message>{message || genericMessage}</Message>
      <Button type="button" onClick={onReset}>
        Prøv igjen
      </Button>
    </Container>
  );
}
