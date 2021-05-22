import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { SecondaryTitle } from '../common/atoms/SecondaryTitle';
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

export const About: React.FC = () => {
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
          {/* eslint-disable-next-line react/jsx-no-target-blank */}
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
      <Article>
        <SecondaryTitle id="cookies">
          Informasjonskapsler og personvern
        </SecondaryTitle>
        <p>Ordsky.no bruker informasjonskapsler.</p>
        <p>
          Bruk av informasjonskapsler er regulert i Lov om elektronisk
          kommunikasjon (ekomloven) § 2-7b. En informasjonskapsel er en liten
          tekstfil som nettstedet ber om å få lagre på din datamaskin.
          Informasjonskapselen samler inn informasjon om hvordan du bruker
          nettstedet – for eksempel hvilke sider du går til oftest og hvilke
          valg du gjør mens du bruker dem.
        </p>
        <p>
          Informasjonen gir meg statistikk jeg kan bruke når jeg utvikler
          nettstedet videre.
        </p>
        <p>
          Jeg får statistikken fra verktøyet Google Analytics. Det medfører at
          din bruk av denne nettsiden, inklusiv din ip-adresse, kan bli overført
          til og lagret av Google. Denne informasjonen vil i så fall bli
          behandlet i tråd med{' '}
          <Link
            href="https://policies.google.com/technologies/partner-sites?hl=no"
            target="_blank"
            rel="noreferrer noopener"
          >
            Googles personvernpolicy
          </Link>
          .{' '}
        </p>
        <p>
          Informasjonskapselene kan ikke identifisere hvem du er og lagrer ingen
          personlige opplysninger.
        </p>
        <p>
          Dersom du ønsker å deaktivere informasjonskapsler for din nettleser,
          kan du gjøre dette via nettleserens sikkerhetsinnstillinger. Du kan
          også stille inn nettleseren slik at du blir varslet hver gang
          nettstedet prøver å legge en informasjonskapsel på datamaskinen.
          Gjennom nettleseren kan du også slette informasjonskapsler som
          allerede er lagret på maskinen.
        </p>
        <p>
          Se nettleserens hjelpesider for mer informasjon om hvordan du gjør
          dette.
        </p>
      </Article>
    </AboutContainer>
  );
};
