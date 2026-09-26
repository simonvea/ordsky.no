import React from 'react';
import styled from 'styled-components';
import { Title } from '../common/atoms/Title';
import { OptionsContainer, Option, OptionTitle } from '../common/atoms/Option';
import { NavButton } from '../common/atoms/Button';
import { BackButton } from '../common/atoms/BackButton';

const Container = styled.section`
  color: var(--text-color-primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CreatePage = (): React.ReactElement => {
  return (
    <Container>
      <Title>Lag en ny ordsky</Title>
      <OptionsContainer>
        <Option>
          <OptionTitle>Fra tekst</OptionTitle>
          <p>
            Lim inn tekst fra et dokument eller en nettside. Ordene telles, og
            de som går igjen oftest blir størst.
          </p>
          <NavButton to="/text">Lim inn tekst</NavButton>
        </Option>
        <Option>
          <OptionTitle>Fra egne ord</OptionTitle>
          <p>
            Skriv inn ordene selv og bestem hvor store de skal være i forhold
            til hverandre.
          </p>
          <NavButton to="/words">Skriv inn ord</NavButton>
        </Option>
        <Option>
          <OptionTitle>Sammen med andre</OptionTitle>
          <p>
            Flere sender inn ord, enten samtidig i et klasserom eller møte,
            eller over tid via en lenke, for eksempel til en avskjed eller
            bursdag.
          </p>
          <NavButton to="/felles">Lag en felles ordsky</NavButton>
        </Option>
      </OptionsContainer>
      <BackButton />
    </Container>
  );
};
