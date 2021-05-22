import React from 'react';
import styled from 'styled-components';
import { Spinner as LoaderSpinner } from '../atoms/Spinner';

export interface SpinnerProps {
  message?: string;
}

const Loader = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Text = styled.span`
  margin-left: 8px;
`;

export const Spinner: React.FC<SpinnerProps> = function Spinner({ message }) {
  return (
    <Loader>
      <LoaderSpinner />
      <Text>{message && message}</Text>
    </Loader>
  );
};
