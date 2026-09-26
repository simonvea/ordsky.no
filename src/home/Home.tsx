import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LinkButton } from '../common/atoms/Button';
import { SampleCloud } from './SampleCloud';

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
  display: flex;

  @media (max-width: 600px) {
    > a {
      width: 100%;
    }
  }
`;

const UseCases = styled.p`
  max-width: 34rem;
  margin-top: 1rem;
  text-align: center;
  color: var(--on-surface-variant);
`;

const Hero = styled.section`
  width: 100%;
  max-width: 640px;
  text-align: center;
`;

const Headline = styled.h1`
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 600;
  margin: 0 0 1rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Lead = styled.p`
  font-size: 1.125rem;
  color: var(--on-surface-variant);
  max-width: 34rem;
`;

const ActionContainer = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  margin-top: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const Home: React.FC = function Home() {
  return (
    <>
      <Hero>
        <Headline>Lag en ordsky på sekunder</Headline>
        <Lead>
          Lim inn en tekst, skriv inn egne ord eller samle inn ord fra kolleger,
          venner eller en skoleklasse. Ordene som går igjen oftest blir størst.
          Gratis, og uten innlogging.
        </Lead>
        <ActionContainer aria-label="Lag en ordsky">
          <AnimatedNavWrapper $delay={0}>
            <LinkButton to="text">Fra tekst</LinkButton>
          </AnimatedNavWrapper>
          <AnimatedNavWrapper $delay={0.1}>
            <LinkButton to="words" $variant="tonal">
              Fra egne ord
            </LinkButton>
          </AnimatedNavWrapper>
          <AnimatedNavWrapper $delay={0.2}>
            <LinkButton to="felles" $variant="tonal">
              Sammen med andre
            </LinkButton>
          </AnimatedNavWrapper>
        </ActionContainer>
      </Hero>
      <SampleCloud />
      <UseCases>
        Passer som avskjedshilsen til en kollega, til bursdager, i
        presentasjoner og i undervisning. Last ned som PNG eller SVG.
      </UseCases>
    </>
  );
};
