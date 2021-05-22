import React from 'react';
import { useMachine } from '@xstate/react';
import { StartSession } from './StartSession';
import { WaitScreen } from './WaitScreen';
import { sessionMachine } from './StateMachine';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { WordsInput } from '../common/molecules/WordsInput';

export const CollaborativePage: React.FC = () => {
  const [state, send] = useMachine(sessionMachine);
  const {
    isAdmin,
    wordEntries,
    id,
    cloud,
    wordCount,
    errorMessage,
  } = state.context;

  const onNewSession = (): void => {
    send('START_SESSION');
  };

  const onJoinSession = (idToJoin: string): void => {
    send({ type: 'JOIN_SESSION', id: idToJoin });
  };

  const onCreateCloud = (): void => {
    send('CREATE_CLOUD');
  };

  const restart = (): void => {
    send('RESTART');
  };

  const onSubmitWords = (words: string[]): void => {
    send({ type: 'ADD_WORDS', words });
  };

  const wordsInputTitle = `Kode: ${id.toUpperCase()}`;

  const restartText = 'Bli med i en ny økt';

  switch (state.value) {
    case 'idle':
      return (
        <StartSession
          onNewSession={onNewSession}
          onJoinSession={onJoinSession}
        />
      );
    case 'wordsInput':
      return (
        <WordsInput
          title={wordsInputTitle}
          onSubmit={onSubmitWords}
          onQuit={restart}
        />
      );
    case 'addWords':
    case 'creating':
    case 'waiting':
      return (
        <WaitScreen
          isAdmin={isAdmin}
          onCreateWordCloud={onCreateCloud}
          numberOfEntries={wordEntries}
          onQuit={restart}
          id={id}
          loading={state.matches('creating')}
        />
      );
    case 'created':
      if (!cloud || !wordCount)
        return (
          <ErrorScreen
            message="Oups! Noe gikk galt når jeg forsøkte å hente ordskyen."
            onReset={restart}
          />
        );
      return (
        <CloudDisplay
          cloud={cloud}
          wordCount={wordCount}
          onRestart={restart}
          restartText={restartText}
        />
      );
    case 'error':
      return <ErrorScreen message={errorMessage} onReset={restart} />;
    default:
      return (
        <StartSession
          onNewSession={onNewSession}
          onJoinSession={onJoinSession}
        />
      );
  }
};
