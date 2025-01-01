import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Button } from '../common/atoms/Button';
import { Title } from '../common/atoms/Title';
import { NavButton } from '../common/atoms/NavButton';
import { CollectService } from './collect/services/CollectService';

const Container = styled.section`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #ffffff;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
`;

const Option = styled.section`
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  p {
    font-size: 1.125rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    color: #e0e0e0;

    &:last-of-type {
      flex-grow: 1;
    }
  }

  strong {
    color: #ffffff;
    font-size: 1.25rem;
    display: block;
    margin-bottom: 1.5rem;
    text-align: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #3a3a3a;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
`;

const service = new CollectService();

export const FellesPage: React.FC = function FellesPage() {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    isLoading: false,
    loadingMessage: '',
    errorMessage: '',
  });

  const createAsyncSession = async (): Promise<void> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      loadingMessage: 'Starter økt..',
    }));

    const session = await service.startSession();

    if (!session) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        loadingMessage: '',
        errorMessage: 'Kunne ikke starte økt',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: false,
      loadingMessage: '',
    }));

    navigate(`/felles/${session.id}?admin=true`);
  };

  return (
    <Container>
      <Title>Lag ordsky i fellesskap</Title>
      <OptionsContainer>
        <Option>
          <p>
            <strong>Live økt:</strong> Perfekt for skoleklasser og i andre
            sammenhenger hvor man sitter sammen, slik som møter.
          </p>
          <p>
            Alle deltakere ser statusen i sanntid, og ordskyen vises samtidig
            for alle når den er ferdig.
          </p>
          <ButtonWrapper>
            <NavButton to="live">Start live økt</NavButton>
          </ButtonWrapper>
        </Option>
        {/* <Option>
          <p>
            <strong>Tradisjonell økt:</strong> Deltakere kan sende inn ord når
            det passer dem.
          </p>
          <p>
            Du kan senere lage en ordsky av de innsamlede ordene og dele
            resultatet via en lenke.
          </p>
          <ButtonWrapper>
            <Button onClick={createAsyncSession}>Start tradisjonell økt</Button>
          </ButtonWrapper>
        </Option> */}
      </OptionsContainer>
    </Container>
  );
};
