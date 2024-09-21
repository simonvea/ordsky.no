import React from 'react';
import { useMachine } from '@xstate/react';
import { StartSession } from './components/StartSession';
import { WaitScreen } from './components/WaitScreen';
import { sessionMachine } from './state/SessionMachine';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { WordsInput } from '../common/molecules/WordsInput';

export function CollaborativePage(): React.ReactElement {
  const [snapshot, send] = useMachine(sessionMachine);
  const { isAdmin, wordEntries, id, cloud, wordCount, errorMessage } =
    snapshot.context;

  const onNewSession = (): void => {
    send({ type: 'START_SESSION' });
  };

  const onJoinSession = (idToJoin: string): void => {
    send({ type: 'JOIN_SESSION', id: idToJoin });
  };

  const onCreateCloud = (): void => {
    send({ type: 'CREATE_CLOUD' });
  };

  const restart = (): void => {
    send({ type: 'RESTART' });
  };

  const onSubmitWords = (words: string[]): void => {
    send({ type: 'ADD_WORDS', words });
  };

  const wordsInputTitle = `Kode: ${id.toUpperCase()}`;

  const restartText = 'Bli med i en ny økt';

  const isWaiting =
    snapshot.matches('addWords') ||
    snapshot.matches('creating') ||
    snapshot.matches('waiting');

  return (
    <>
      {snapshot.matches('idle') && (
        <StartSession
          onNewSession={onNewSession}
          onJoinSession={onJoinSession}
        />
      )}
      {snapshot.matches('wordsInput') && (
        <WordsInput
          title={wordsInputTitle}
          onSubmit={onSubmitWords}
          onQuit={restart}
        />
      )}
      {isWaiting && (
        <WaitScreen
          isAdmin={isAdmin}
          onCreateWordCloud={onCreateCloud}
          numberOfEntries={wordEntries}
          onQuit={restart}
          id={id}
          loading={snapshot.matches('creating')}
        />
      )}
      {snapshot.matches('created') && !!cloud && !!wordCount && (
        <CloudDisplay
          cloud={cloud}
          wordCount={wordCount}
          onRestart={restart}
          restartText={restartText}
        />
      )}
      {(snapshot.matches('created') && !cloud) ||
        (!!wordCount && (
          <ErrorScreen
            message="Oups! Noe gikk galt når jeg forsøkte å hente ordskyen."
            onReset={restart}
          />
        ))}
      {snapshot.matches('error') && (
        <ErrorScreen message={errorMessage} onReset={restart} />
      )}
    </>
  );
}
