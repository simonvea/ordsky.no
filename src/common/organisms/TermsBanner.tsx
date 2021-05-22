import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SecondaryButton } from '../atoms/Button';

type TermsBannerProps = {
  onClose: () => void;
};

const TermsContainer = styled.div`
  height: 80px;
  background-color: var(--secondary-color-light);
  color: black;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  p {
    margin: 0;
  }
`;

export const TermsBanner: React.FC<TermsBannerProps> = function TermsBanner({
  onClose,
}) {
  return (
    <TermsContainer>
      <p>
        Dette nettstedet bruker informasjonskapsler for trafikkanalyse.{' '}
        <Link to="/about#cookies">Finn ut mer</Link>.
      </p>
      <SecondaryButton type="button" onClick={onClose} small>
        Lukk
      </SecondaryButton>
    </TermsContainer>
  );
};
