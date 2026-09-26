import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonVariant } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { copyText } from "../core/copyText";

const Field = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

// Selectable so the link can still be copied by hand when the clipboard API fails.
const LinkInput = styled(Input)`
  flex: 1 1 14rem;
  width: auto;
  margin: 0;
  user-select: all;

  @media only screen and (min-width: 768px) {
    width: auto;
  }
`;

const Status = styled.span`
  flex-basis: 100%;
  min-height: 1.5rem;
  font-size: 0.875rem;
  color: var(--on-surface-variant);
`;

export type CopyLinkFieldProps = {
  link: string;
  label: string;
  variant?: ButtonVariant;
};

export const CopyLinkField = ({
  link,
  label,
  variant = "filled",
}: CopyLinkFieldProps): React.ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = async (): Promise<void> => {
    inputRef.current?.select();
    const copied = await copyText(link);
    setStatus(
      copied
        ? "Lenken er kopiert."
        : "Kunne ikke kopiere. Marker og kopier lenken selv.",
    );
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus(""), 3000);
  };

  return (
    <Field>
      <LinkInput
        ref={inputRef}
        readOnly
        value={link}
        aria-label={label}
        onFocus={(event) => event.target.select()}
      />
      <Button $variant={variant} type="button" onClick={copy}>
        <FontAwesomeIcon icon={faLink} />
        {label}
      </Button>
      <Status role="status">{status}</Status>
    </Field>
  );
};
