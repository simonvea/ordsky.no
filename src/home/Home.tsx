import React from 'react';
import { Container } from '../common/atoms/Container';
import { TextContainer } from '../common/atoms/TextContainer';
import { NavButton } from '../common/atoms/NavButton';

export const Home: React.FC = function Home() {
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
      <Container>
        <NavButton to="words">Lag en ordsky</NavButton>
      </Container>
    </>
  );
};
