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
  padding: 1rem;
  background-color: #eff6ff;
  border-radius: 0.5rem;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #1e3a8a;
  font-size: 1.2rem;
  line-height: 1;

  &:hover {
    color: #1e40af;
  }
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  color: #1e40af;
  margin-bottom: 1rem;
`;

const VippsNumber = styled.div`
  font-weight: 500;
  color: #1e3a8a;
`;

export function SupportCallout(): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

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
