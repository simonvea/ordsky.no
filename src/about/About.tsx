import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Title } from '../common/atoms/Title';

const AboutContainer = styled.section`
  background-color: var(--text-color-primary);
  color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 8px 16px;
`;

const Article = styled.article`
  margin: 1rem 0;
  padding: 1rem;

  p {
    font-size: 1.125rem;
    line-height: 1.5625rem;
    width: calc(100% - 40px);
    max-width: 600px;
    text-rendering: optimizeLegibility;
  }
`;

const Link = styled.a`
  color: #000;
  text-emphasis: underline;
`;

export function About(): React.ReactElement {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <AboutContainer>
      <Article>
        <Title>Om Ordsky.no</Title>
        <p>
          Ordsky.no er et lite hobbyprosjekt laget av{' '}
          <Link
            href="https://www.simonsier.no/about/"
            target="_blank"
            rel="noopener"
          >
            Simon Opheim
          </Link>
          .
        </p>
        <p>
          Da jeg har mye å gjøre og{' '}
          <Link
            href="https://github.com/simonvea"
            target="_blank"
            rel="noopener noreferrer"
          >
            flere andre hobbyprosjekter
          </Link>
          , blir denne nettsiden oppdatert sporadisk.
        </p>
        <p>
          Om du er fornøyd med produktet, eller har lyst å støtte meg i
          videreutviklingen, så er jeg veldig glad i en kopp kaffe. Spander
          gjerne via Vipps til tlf 93254119 =)
        </p>
        <p>
          Om det er noe du mener bør fikses kjapt, eller du har andre
          tilbakemeldinger. Send meg gjerne en{' '}
          <Link
            href="mailto:simon@ordsky.no?subject=Jeg liker ordsky.no, men"
            target="_blank"
            rel="noopener noreferrer"
          >
            mail
          </Link>
          .
        </p>
      </Article>
    </AboutContainer>
  );
}
