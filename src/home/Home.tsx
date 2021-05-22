import React from 'react';
import { Button } from '../common/atoms/Button';
import { Container } from '../common/atoms/Container';
import { TextContainer } from '../common/atoms/TextContainer';

export type HomeProps = {
  onClickCreate: () => void;
};

export const Home: React.FC<HomeProps> = function Home({ onClickCreate }) {
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
        <Button onClick={onClickCreate}>Lag en ordsky</Button>
      </Container>
    </>
  );
};
