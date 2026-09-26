import React from 'react';
import styled from 'styled-components';
import { Spinner as LoaderSpinner } from '../atoms/Spinner';

export interface SpinnerProps {
  message?: string;
}

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 0;
  color: var(--on-surface-variant);
`;



export const Spinner: React.FC<SpinnerProps> = function Spinner({ message }) {
  return (
    <Loader role="status">
      <LoaderSpinner />
      {message && <span>{message}</span>}
    </Loader>
  );
};
