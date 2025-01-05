import React, { useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router';
import styled from 'styled-components';
import { Title } from '../common/atoms/Title';

const ContactContainer = styled.section`
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

const BackContainer = styled.section`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`;

export function Contact(): React.ReactElement {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <ContactContainer>
      <Article>
        <Title>Om Ordsky.no</Title>
        <p>
          Ordsky.no er et lite hobbyprosjekt laget av{' '}
          <Link
            href="https://github.com/simonvea"
            target="_blank"
            rel="noopener noreferrer"
          >
            Simon Opheim
          </Link>
          .
        </p>
        <p>
          Om det er noe du mener bør fikses kjapt, eller du har andre
          tilbakemeldinger. Send meg gjerne et{' '}
          <Link
            href="mailto:simon@ordsky.no?subject=Jeg liker ordsky.no, men"
            target="_blank"
            rel="noopener noreferrer"
          >
            elektronisk brev
          </Link>
          .
        </p>
        <p>
          Er du fornøyd med produktet, eller har lyst å støtte meg i
          videreutviklingen, så er jeg veldig glad i en kopp kaffe. Spander
          gjerne via Vipps til tlf 93254119 =)
        </p>
        <BackContainer>
          <RouterLink to="/" color="rgba(0, 0, 0, 0.8)">
            Til fremsiden
          </RouterLink>
        </BackContainer>
      </Article>
    </ContactContainer>
  );
}
