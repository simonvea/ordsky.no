import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { copyText } from "../core/copyText";

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

// Selectable so the link can still be copied by hand when the clipboard API fails.
const LinkInput = styled(Input)`
  width: 100%;
  max-width: 420px;
  margin: 0;
  text-align: center;
  user-select: all;
`;

const Status = styled.span`
  min-height: 1.5rem;
`;

export type CopyLinkFieldProps = {
  link: string;
  label: string;
};

export const CopyLinkField = ({
  link,
  label,
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
        ? "Kopiert link!"
        : "Kunne ikke kopiere. Marker og kopier linken selv.",
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
      <Button $small type="button" onClick={copy}>
        <FontAwesomeIcon icon={faLink} style={{ marginRight: "0.6rem" }} />
        {label}
      </Button>
      <Status role="status">{status}</Status>
    </Field>
  );
};
