import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Cloud, WordCount } from '../../common/core/cloud.types';
import {
  getSession,
  getWordsAndCreateCloud,
  saveWords,
} from './services/CollectService';
import { WordsInput } from '../../common/molecules/WordsInput';
import { CloudDisplay } from '../../common/organisms/CloudDisplay';
import { ErrorScreen } from '../../common/molecules/ErrorScreen';
import { Spinner } from '../../common/molecules/Spinner';
import { WaitScreen } from './components/WaitScreen';
import { useCallToAction } from '../../common/hooks/useCallToAction';
import { Welcome } from './components/Welcome';
import { SubmittedWords } from './components/SubmittedWords';

type Props = {};

type CollectState = {
  loading: boolean;
  cloud?: Cloud[];
  wordCount?: WordCount;
  numberOfEntries: number;
  loadingMessage: string;
  errorMessage: string;
  hasSubmittedWords: boolean;
};

const initialState: CollectState = {
  loading: false,
  numberOfEntries: 0,
  loadingMessage: '',
  errorMessage: '',
  hasSubmittedWords: false,
};

export function CollectPage(): React.ReactElement {
  const navigate = useNavigate();

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { shouldDisplayCallToAction } = useCallToAction({
    shouldShowOnFirstVisit: true,
  });

  const isAdmin = searchParams.get('admin') === 'true';

  const [
    {
      errorMessage,
      loading,
      loadingMessage,
      numberOfEntries,
      cloud,
      wordCount,
      hasSubmittedWords,
    },
    setState,
  ] = React.useState<CollectState>(initialState);

  useEffect(() => {
    if (!id || id.length !== 5) return;

    setState((prev) => ({
      ...prev,
      loading: true,
      loadingMessage: 'Sjekkerer økt...',
    }));

    getSession(id)
      .then((session) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          loadingMessage: '',
          ...session,
        }));
      })
      .catch((error) => {
        if ((error as Error).message === '404') {
          // A new session won't be created until the user submits words
          setState((prev) => ({
            ...prev,
            loading: false,
            loadingMessage: '',
          }));
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          loadingMessage: '',
          errorMessage:
            'Noe gikk galt ved henting av øktdata: ' + error.message,
        }));
      });
  }, [id]);

  const handleSubmitWords = async (words: string[]): Promise<void> => {
    if (!id) return;

    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        loadingMessage: 'Sender ord..',
      }));

      const session = await saveWords({ id, words });

      setState((prev) => ({
        ...prev,
        ...session,
        hasSubmittedWords: true,
        loading: false,
        loadingMessage: '',
      }));
    } catch (error) {
      console.error((error as Error).message);

      setState((prev) => ({
        ...prev,
        loading: false,
        loadingMessage: '',
        errorMessage:
          'Noe gikk galt i forsøket på å lagre ordene: ' +
          (error as Error).message,
      }));
    }
  };

  const handleCreateCloud = async (): Promise<void> => {
    if (!id) return;

    setState((prev) => ({
      ...prev,
      loading: true,
      loadingMessage: 'Lager ordsky...',
    }));

    const session = await getWordsAndCreateCloud(id);

    setState((prev) => ({
      ...prev,
      ...session,
      loading: false,
    }));
  };

  const handleQuit = (): void | Promise<void> => navigate('../');

  if (errorMessage) {
    return <ErrorScreen message={errorMessage} onReset={handleQuit} />;
  }

  if (loading) {
    return <Spinner message={loadingMessage} />;
  }

  if (!id || id.length !== 5) {
    return (
      <ErrorScreen message="Ugyldig id" onReset={() => navigate('/collect')} />
    );
  }

  if (hasSubmittedWords) {
    return (
      <SubmittedWords
        onAddMoreWords={() =>
          setState((prev) => ({ ...prev, hasSubmittedWords: false }))
        }
        onQuit={handleQuit}
      />
    );
  }

  const restartText = isAdmin ? 'Start en ny økt' : 'Lag din egen økt';

  return (
    <>
      {isAdmin && !cloud && (
        <WaitScreen
          id={id}
          initialEntries={numberOfEntries}
          loading={loading}
          onQuit={handleQuit}
          onCreateWordCloud={handleCreateCloud}
        />
      )}
      {!isAdmin && !cloud && (
        <WordsInput onSubmit={handleSubmitWords} onQuit={handleQuit} />
      )}
      {!!cloud && (
        // TODO: ADD SHARABLE LINK
        <CloudDisplay
          cloud={cloud}
          wordCount={wordCount}
          onRestart={handleQuit}
          restartText={restartText}
          shouldDisplayCallToAction={isAdmin && shouldDisplayCallToAction}
        />
      )}
    </>
  );
}
