import React from 'react';
import styled from 'styled-components';
import { Title } from '../common/atoms/Title';
import { OptionsContainer, Option } from '../common/atoms/Option';
import { NavButton } from '../common/atoms/NavButton';
import { BackButton } from '../common/atoms/BackButton';

const Container = styled.section`
  color: var(--text-color-primary);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const StyledOption = styled(Option)`
  padding: 1rem;
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const StyledNavButton = styled(NavButton)`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    max-width: 16rem;
    margin: 0 auto;
  }
`;

export const CreatePage = (): React.ReactElement => {
  return (
    <Container>
      <Title>Lag en ny ordsky</Title>
      <OptionsContainer>
        <StyledOption>
          <p>
            <strong>Lim inn tekst:</strong> Kopier og lim inn tekst for å lage
            ordskyen.
          </p>
          <p>
            Denne metoden lar deg raskt lage en ordsky ved å kopiere og lime inn
            tekst fra et dokument eller en nettside.
          </p>
          <StyledNavButton to="/text">Lim inn tekst</StyledNavButton>
        </StyledOption>
        <StyledOption>
          <p>
            <strong>Legg til ord:</strong> Fyll inn ordene manuelt.
          </p>
          <p>
            Du kan manuelt legge til ord og justere deres frekvens for å skape
            en mer tilpasset ordsky.
          </p>
          <StyledNavButton to="/words">Legg til ord</StyledNavButton>
        </StyledOption>
        <StyledOption>
          <p>
            <strong>Felles ordsky:</strong> Samarbeid med andre for å lage en
            ordsky.
          </p>
          <p>
            Perfekt for situasjoner hvor flere deltakere skal bidra med ord,
            enten i sanntid eller over tid.
          </p>
          <StyledNavButton to="/felles">Lag en felles ordsky</StyledNavButton>
        </StyledOption>
      </OptionsContainer>
      <BackButton />
    </Container>
  );
};
