import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { Title } from '../common/atoms/Title';
import { StyledLink } from '../common/atoms/StyledLink';
import { BackButton } from '../common/atoms/BackButton';
import { ContentArticle } from '../common/atoms/ContentArticle';

const AboutContainer = styled.section`
  color: var(--text-color-primary);
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const SubTitle = styled.h2`
  margin: 3rem 0 1.5rem;
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--text-color-primary);
`;

const TableOfContents = styled.nav`
  margin: 2.5rem 0 3.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 780px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 1rem 0;
    padding-left: 1rem;
    border-left: 2px solid rgba(255, 255, 255, 0.1);
    transition: border-left-color 0.2s ease;

    &:hover {
      border-left-color: var(--primary-color);
    }
  }

  a {
    color: var(--text-color-secondary);
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 1.1rem;
    padding: 0.25rem 0;
    display: block;
    font-weight: 300;

    &:hover {
      color: var(--primary-color);
      transform: translateX(8px);
    }
  }
`;

export function About(): React.ReactElement {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <AboutContainer>
      <ContentArticle>
        <Title id="title">Om Ordsky</Title>

        <p>
          Ordsky.no er et lite hobbyprosjekt laget av{' '}
          <StyledLink
            href="https://github.com/simonvea"
            target="_blank"
            rel="noopener noreferrer"
          >
            Simon Opheim
          </StyledLink>
          .
        </p>

        <TableOfContents>
          <ul>
            <li>
              <a href="#bruk">Hva kan en ordsky brukes til?</a>
            </li>
            <li>
              <a href="#hvordan">Hvordan fungerer det?</a>
            </li>
            <li>
              <a href="#personvern">Personvern og data</a>
            </li>
          </ul>
        </TableOfContents>

        <SubTitle id="bruk">Hva kan en ordsky brukes til?</SubTitle>

        <p>
          En ordsky kan være svært nyttig på mange måter! Ordsky.no hjelper deg
          med å identifisere hvilke ord som er mest fremtredende i en tekst,
          fordi de største ordene vises oftest. Du kan bruke ordskyer i
          skoleprosjekter, presentasjoner eller for å analysere tekstdata på en
          visuell og enkel måte.
        </p>

        <p>
          Det er viktig å merke seg at andre metoder for å representere data
          noen ganger kan være mer hensiktsmessige. For eksempel kan grafer og
          tabeller gi mer presise og detaljerte dataanalyser. Selv om ordskyer
          gir en rask visuell oversikt, gir de ikke alltid den mest nøyaktige
          informasjonen.
        </p>

        <p>
          Av denne grunn vises ordene som forekommer flest ganger alltid i en
          graf under ordskyen. Så selv om ordskyer er en morsom og nyttig måte å
          se på tekst på, kan det noen ganger lønne seg å bruke andre metoder
          for å få et dypere og klarere bilde av teksten eller dataen din.
        </p>

        <SubTitle id="hvordan">Hvordan fungerer det?</SubTitle>

        <p>
          Først telles alle ordene i teksten eller ordlisten som du har samlet
          inn. Størrelsen på hvert ord beregnes deretter basert på hvor ofte det
          forekommer.
        </p>

        <p>
          Selve ordskyen skapes ved først å plassere det viktigste ordet midt på
          siden. Deretter plasseres de nest viktigste ordene ett etter ett. Hvis
          et ord treffer et annet ord, flyttes det forsiktig rundt til det
          finner en ledig plass. Denne prosessen gjentas for hvert ord til alle
          ordene er plassert uten overlapping, og du får stilige bilder der
          ordene er plassert uten å kollidere med hverandre.
        </p>

        <p>
          Ordsky.no bruker et JavaScript-bibliotek kalt d3-cloud for å generere
          ordskyer etter at teksten er analysert. Dette biblioteket er åpent og
          kan finnes på{' '}
          <StyledLink
            href="https://github.com/jasondavies/d3-cloud"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub.
          </StyledLink>
        </p>

        <SubTitle id="personvern">Personvern og data</SubTitle>

        <p>
          Når du limer inn tekst eller ord på ordsky.no på vanlig måte, blir
          ingenting lagret eller sendt bort fra nettsiden. Alt foregår i din
          nettleser og dataene blir slettet når du lukker siden.
        </p>

        <p>
          Hvis du ønsker å lage en felles ordsky, blir dataene du legger inn
          lagret midlertidig på en server for å kunne være tilgjengelig til når
          du genererer ordskyen. Disse dataene slettes etter en viss tid, noe
          som sikrer at dine data kun brukes til formålet med ordsky
          genereringen.
        </p>

        <p>
          Ordsky.no samler ikke inn personlig data om bruk eller brukere. Jeg
          bruker{' '}
          <StyledLink
            href="https://www.cloudflare.com/web-analytics/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare web analytics
          </StyledLink>{' '}
          for anonymisert trafikkdata, som hjelper meg med å forbedre nettsiden.
          Trafikkdataen fra Cloudflare bruker ikke cookies. Nettsiden holdes
          reklamefri ut fra prinsipp.
        </p>
        <p>
          Nettsiden koster likevel penger å drifte, så hvis du ønsker å støtte
          prosjektet, kan du gjerne sende en donasjon via Vipps til tlf
          93254119. Et bidrag tilsvarende en kopp kaffe er ofte nok.
        </p>
        <BackButton />
      </ContentArticle>
    </AboutContainer>
  );
}
