import React from 'react';
import { Container } from '../common/atoms/Container';
import { TextContainer } from '../common/atoms/TextContainer';
import styled, { keyframes } from 'styled-components';
import { Button, LinkButton } from '../common/atoms/Button';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedNavWrapper = styled.div<{ $delay: number }>`
  opacity: 0;
  animation: ${fadeInUp} 0.3s ease forwards;
  animation-delay: ${(props) => props.$delay}s;
  flex: 1;
  display: flex;
  > a {
    width: 100%;
  }
`;

const ActionContainer = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: stretch;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TransitionContainer = styled.div`
  grid-row: 1;
  grid-column: 1;
`;

const GridWrapper = styled.div`
  margin-top: 2rem;
  display: grid;
  min-height: 200px;
`;

export const Home: React.FC = function Home() {
  const [showOptions, setShowOptions] = React.useState(false);

  return (
    <>
      <TextContainer>
        <article>
          <p>
            Ordsky.no er et verktøy for å lage en enkel ordsky fra tekst.
            Ordskyen gir større vekt til ord som fremkommer oftere i teksten.
          </p>
          <p>
            Ordskyen er perfekt å bruke til presentasjoner laget i for eksempel
            word eller powerpoint.
          </p>
        </article>
      </TextContainer>
      <GridWrapper>
        <TransitionContainer>
          {showOptions ? (
            <ActionContainer>
              <AnimatedNavWrapper $delay={0.1}>
                <LinkButton to="text">Lag en ordsky fra tekst</LinkButton>
              </AnimatedNavWrapper>
              <AnimatedNavWrapper $delay={0}>
                <LinkButton to="words">Lag en ordsky fra ord</LinkButton>
              </AnimatedNavWrapper>
              <AnimatedNavWrapper $delay={0.2}>
                <LinkButton to="felles">Lag en ordsky sammen</LinkButton>
              </AnimatedNavWrapper>
            </ActionContainer>
          ) : (
            <Container>
              <Button onClick={() => setShowOptions(true)}>
                Lag en ordsky
              </Button>
            </Container>
          )}
        </TransitionContainer>
      </GridWrapper>
    </>
  );
};
