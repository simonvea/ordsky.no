import React, { useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router';
import styled from 'styled-components';
import { Title } from '../common/atoms/Title';

const AboutContainer = styled.section`
  background-color: var(--text-color-primary);
  color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 24px 32px;
  max-width: 900px;
  margin: 0 auto;
`;

const Article = styled.article`
  margin: 1.5rem 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    margin: 2rem 0 1rem;
    font-size: 1.5rem;
    color: rgba(0, 0, 0, 0.9);
  }

  p {
    font-size: 1.125rem;
    line-height: 1.75;
    width: 100%;
    max-width: 720px;
    margin: 1rem 0;
    text-rendering: optimizeLegibility;
    color: rgba(0, 0, 0, 0.75);
  }
`;

const Link = styled(RouterLink)`
  color: #000;
  // text-decoration: underline;
  border-bottom: 2px solid currentColor;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const BackContainer = styled.section`
  margin-top: 3rem;
  display: flex;
  justify-content: center;

  a {
    color: rgba(0, 0, 0, 0.8);
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const TableOfContents = styled.nav`
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0.75rem 0;
    padding-left: 0.5rem;
    border-left: 2px solid rgba(0, 0, 0, 0.1);
  }

  a {
    color: rgba(0, 0, 0, 0.75);
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 1.1rem;
    padding: 0.25rem 0;
    display: block;

    &:hover {
      color: rgba(0, 0, 0, 0.95);
      transform: translateX(4px);
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
      <Article>
        <Title id="title">Om Ordsky</Title>

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

        <h3 id="bruk">Hva kan en ordsky brukes til?</h3>

        <p>
          Ordsky.no kan være svært nyttig på mange måter! Ordsky-generatoren
          hjelper deg med å identifisere hvilke ord som er mest fremtredende i
          en tekst, fordi de største ordene vises oftest. Du kan bruke ordskyer
          i skoleprosjekter, presentasjoner eller for å analysere tekstdata på
          en visuell og enkel måte.
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

        <h3 id="hvordan">Hvordan fungerer det?</h3>

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
          <a
            href="https://github.com/jasondavies/d3-cloud"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub.
          </a>
        </p>

        <h3 id="personvern">Personvern og data</h3>

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
          <a
            href="https://www.cloudflare.com/web-analytics/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare web analytics
          </a>{' '}
          for anonymisert trafikkdata, som hjelper meg med å forbedre nettsiden.
          Trafikkdataen fra Cloudflare bruker ikke cookies. Nettsiden holdes
          reklamefri ut fra prinsipp.
        </p>
        <p>
          Nettsiden koster likevel penger å drifte, så hvis du ønsker å støtte
          prosjektet, kan du gjerne sende en donasjon via Vipps til tlf
          93254119. Et bidrag tilsvarende en kopp kaffe er ofte nok.
        </p>
        <BackContainer>
          <Link to="/" color="rgba(0, 0, 0, 0.8)">
            Til fremsiden
          </Link>
        </BackContainer>
      </Article>
    </AboutContainer>
  );
}
