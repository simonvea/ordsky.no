import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { Button, NavButton } from "../common/atoms/Button";
import { Title } from "../common/atoms/Title";
import { generateId } from "../common/core/session";
import { getSession } from "./collect/services/CollectService";
import { NewsBadge } from "../common/atoms/NewsBadge";
import { OptionsContainer, Option, OptionTitle } from "../common/atoms/Option";
import { BackButton } from "../common/atoms/BackButton";

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FellesPage: React.FC = function FellesPage() {
  const navigate = useNavigate();

  const createAsyncSession = async (): Promise<void> => {
    let id = generateId();

    try {
      const session = await getSession(id);
      // If the session already exists, try again
      if (!!session) id = generateId();
    } catch {}

    navigate(`/felles/innsamling/${id}?admin=true`);
  };

  return (
    <Container>
      <Title>Lag ordsky i fellesskap</Title>
      <OptionsContainer>
        <Option>
          <OptionTitle>Live-økt</OptionTitle>
          <p>
            For klasserom og møter der alle er til stede. Deltakerne blir med
            via en kode, og ordskyen vises for alle samtidig når du er klar.
          </p>
          <NavButton to="live">Start live-økt</NavButton>
        </Option>
        <Option>
          <OptionTitle>Innsamling</OptionTitle>
          <p>
            Del en lenke, så sender deltakerne inn ord når det passer dem. Fint
            til avskjed med en kollega, bursdager og andre anledninger. Du lager
            ordskyen senere og kan dele resultatet via lenken.
          </p>
          <Button onClick={createAsyncSession}>Start innsamling</Button>
        </Option>
      </OptionsContainer>
      <BackButton />
    </Container>
  );
};
