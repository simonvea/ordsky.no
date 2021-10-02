import React from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/Button';
import { Row } from '../atoms/Row';
import { TextContainer } from '../atoms/TextContainer';

type CookieBannerProps = {
  onAcceptCookies: () => void;
  onDeclineCookies: () => void;
};

const StyledSection = styled.section`
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Form = styled.form`
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 1rem;
  align-items: center;
  max-width: 90%;
  min-width: 50%;
  height: 320px;
  border-radius: 4px;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.2);
`;

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onAcceptCookies,
  onDeclineCookies,
}) => (
  <StyledSection>
    <Form>
      <TextContainer>
        Ordsky.no bruker cookies via Google Analytics for å måle trafikk. Disse
        brukes for å skille brukere av nettsiden, men kan ikke identifisere deg.
      </TextContainer>
      <TextContainer>Er det ok?</TextContainer>
      <Row>
        <Button onClick={onAcceptCookies}>Godta</Button>
        <Button onClick={onDeclineCookies}>Avslå</Button>
      </Row>
    </Form>
  </StyledSection>
);
