import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import { Title } from '../../common/atoms/Title';
import { Form } from '../../common/atoms/Form';
import { Label } from '../../common/atoms/Label';
import { Input } from '../../common/atoms/Input';
import { Button } from '../../common/atoms/Button';
import { Textarea } from '../../common/atoms/Textarea';
import { InfoText } from '../../common/atoms/InfoText';
import { BackButton } from '../../common/atoms/BackButton';
import { Spinner } from '../../common/molecules/Spinner';
import { CloudDisplay } from '../../common/organisms/CloudDisplay';
import { Cloud, WordCount } from '../../common/core/cloud.types';
import { createCloudFromWords } from '../collect/services/CollectService';
import { LookupHit, LookupResult, lookupSession } from './services/LookupService';

type State =
  | { status: 'idle' }
  | { status: 'loading'; id: string }
  | { status: 'found'; id: string; hits: LookupHit[] }
  | { status: 'error'; message: string };

type Action =
  | { type: 'LOOKUP_STARTED'; id: string }
  | { type: 'LOOKUP_FINISHED'; result: LookupResult }
  | { type: 'RESET' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOOKUP_STARTED': {
      return { status: 'loading', id: action.id };
    }
    case 'LOOKUP_FINISHED': {
      if (state.status !== 'loading') return state;
      return action.result.type === 'found'
        ? { status: 'found', id: state.id, hits: action.result.hits }
        : { status: 'error', message: action.result.message };
    }
    case 'RESET': {
      return { status: 'idle' };
    }
  }
};

const kindLabels: Record<LookupHit['kind'], string> = {
  collect: 'Innsamling',
  live: 'Live-økt',
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
`;

const Meta = styled.dl`
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.25rem 1rem;
  margin: 0;

  dt {
    font-weight: 500;
  }

  dd {
    margin: 0;
  }
`;

const WordsArea = styled(Textarea)`
  height: 30vh;
  max-width: 90vw;
`;

const TOP_WORDS = 10;

type HitProps = { hit: LookupHit; onReset: () => void };

function SessionHit({ hit, onReset }: HitProps): React.ReactElement {
  const { kind, session } = hit;

  // A cloud made here is only shown, never saved back to the session
  const [generated, setGenerated] = useState<
    { cloud: Cloud[]; wordCount: WordCount } | undefined
  >();
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const cloud = session.cloud ?? generated?.cloud;
  const wordCount = session.wordCount ?? generated?.wordCount;

  const adminPath = `/felles/innsamling/${session.id}?admin=true`;

  const copyWords = (): void => {
    navigator.clipboard.writeText(session.words.join('\n')).catch(() => {});
  };

  const generateCloud = async (): Promise<void> => {
    setGenerating(true);
    setGenerateError('');
    try {
      setGenerated(await createCloudFromWords(session.words));
    } catch (error) {
      setGenerateError(`Klarte ikke å lage ordsky: ${String(error)}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Section>
      <h2>
        {kindLabels[kind]}: {session.id}
      </h2>
      <Meta>
        <dt>Opprettet</dt>
        <dd>{session.createdAt}</dd>
        <dt>Sist endret</dt>
        <dd>{session.updatedAt}</dd>
        <dt>Innsendinger</dt>
        <dd>{session.numberOfEntries}</dd>
        <dt>Antall ord</dt>
        <dd>{session.words.length}</dd>
      </Meta>
      {kind === 'collect' && (
        <InfoText>
          Admin-lenke: <Link to={adminPath}>{adminPath}</Link>
        </InfoText>
      )}
      <WordsArea readOnly value={session.words.join('\n')} />
      <Button type="button" $small $variant="outlined" onClick={copyWords}>
        Kopier ord
      </Button>
      {cloud ? (
        <CloudDisplay
          cloud={cloud}
          wordCount={wordCount?.slice(0, TOP_WORDS)}
          onRestart={onReset}
          restartText="Hent en annen økt"
          shouldDisplayCallToAction={false}
        />
      ) : (
        session.words.length > 0 &&
        (generating ? (
          <Spinner message="Lager ordsky..." />
        ) : (
          <Button type="button" onClick={generateCloud}>
            Lag ordsky
          </Button>
        ))
      )}
      {generateError && <InfoText>{generateError}</InfoText>}
    </Section>
  );
}

export function LookupPage(): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' });
  const [id, setId] = useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!id.trim()) return;

    dispatch({ type: 'LOOKUP_STARTED', id: id.trim() });

    const result = await lookupSession({
      id,
      collectUrl: import.meta.env.VITE_COLLECT_BASE_URL,
      liveUrl: import.meta.env.VITE_SESSION_API_URL,
    });

    dispatch({ type: 'LOOKUP_FINISHED', result });
  };

  const reset = (): void => {
    setId('');
    dispatch({ type: 'RESET' });
  };

  return (
    <>
      <Title>Hent økt</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="lookup-id">Id</Label>
        <Input
          id="lookup-id"
          value={id}
          onChange={(event) => setId(event.target.value)}
          autoComplete="off"
        />
        <Button type="submit" disabled={state.status === 'loading'}>
          Hent
        </Button>
      </Form>
      {state.status === 'loading' && <Spinner message="Henter økt..." />}
      {state.status === 'error' && <InfoText>{state.message}</InfoText>}
      {state.status === 'found' && state.hits.length === 0 && (
        <InfoText>Ingen økt funnet med id {state.id}.</InfoText>
      )}
      {state.status === 'found' &&
        state.hits.map((hit) => (
          <SessionHit
            key={`${hit.kind}-${hit.session.id}`}
            hit={hit}
            onReset={reset}
          />
        ))}
      <BackButton />
    </>
  );
}
