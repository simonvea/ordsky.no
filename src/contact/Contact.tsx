import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { Title } from '../common/atoms/Title';
import { StyledLink } from '../common/atoms/StyledLink';
import { BackButton } from '../common/atoms/BackButton';
import { ContentArticle } from '../common/atoms/ContentArticle';

const ContactContainer = styled.section`
  color: var(--text-color-primary);
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
`;

export function Contact(): React.ReactElement {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <ContactContainer>
      <ContentArticle>
        <Title>Kontakt</Title>
        <p>
          Om det er noe du mener bør fikses kjapt, eller du har andre
          tilbakemeldinger. Send meg gjerne et{' '}
          <StyledLink
            href="mailto:simon@ordsky.no?subject=Jeg liker ordsky.no, men"
            target="_blank"
            rel="noopener noreferrer"
          >
            elektronisk brev
          </StyledLink>
          .
        </p>
        <p>
          Er du fornøyd med produktet, eller har lyst å støtte meg i
          videreutviklingen, så er jeg veldig glad i en kopp kaffe. Spander
          gjerne via Vipps til tlf 93254119 =)
        </p>
        <BackButton />
      </ContentArticle>
    </ContactContainer>
  );
}
