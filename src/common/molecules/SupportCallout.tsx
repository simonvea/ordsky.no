import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div<{ $display: boolean }>`
  display: ${(props) => (props.$display ? 'block' : 'none')};
  animation: ${fadeIn} 0.5s ease-in;
  position: relative;
  margin-top: 2rem;
  padding: 1.25rem 3rem 1.25rem 1.5rem;
  background-color: var(--surface-container-high);
  border-radius: 16px;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  color: var(--on-surface-variant);
  font-size: 1.5rem;
  line-height: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--text-color-primary);
  }
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
`;

const Message = styled.p`
  color: var(--on-surface-variant);
  margin: 0 0 0.75rem;
`;

const VippsNumber = styled.div`
  font-weight: 600;
  color: var(--on-tonal-container);
`;

export function SupportCallout(): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container $display={isVisible}>
      <CloseButton onClick={() => setIsVisible(false)} aria-label="Lukk">
        ×
      </CloseButton>
      <Title>Liker du Ordsky.no?</Title>
      <Message>
        Hvis du setter pris på denne tjenesten og ønsker å støtte videre
        utvikling, vurder gjerne å gi et bidrag via Vipps. Kanskje til en liten
        kopp kaffe?
      </Message>
      <VippsNumber>Vipps til: 93254119</VippsNumber>
    </Container>
  );
}
