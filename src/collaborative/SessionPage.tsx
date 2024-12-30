import React from 'react';
import { StartSession } from './components/StartSession';
import { WaitScreen } from './components/WaitScreen';
import { ErrorScreen } from '../common/molecules/ErrorScreen';
import { CloudDisplay } from '../common/organisms/CloudDisplay';
import { WordsInput } from '../common/molecules/WordsInput';
import { useSession } from './state/useSession';

export function CollaborativePage(): React.ReactElement {
  const { state, actions } = useSession();

  const {
    isAdmin,
    wordEntries,
    id,
    cloud,
    wordCount,
    errorMessage,
    isLoading,
    ui,
  } = state;

  const {
    startSession,
    createCloud,
    joinSession,
    addWordsToSession,
    endSession,
  } = actions;

  const wordsInputTitle = `Kode: ${id.toUpperCase()}`;

  const restartText = 'Bli med i en ny økt';

  return (
    <>
      {ui == 'idle' && (
        <StartSession onNewSession={startSession} onJoinSession={joinSession} />
      )}

      {ui == 'wordsInput' && (
        <WordsInput
          title={wordsInputTitle}
          onSubmit={addWordsToSession}
          onQuit={endSession}
        />
      )}

      {ui == 'waiting' && (
        <WaitScreen
          isAdmin={isAdmin}
          onCreateWordCloud={() => createCloud(id)}
          numberOfEntries={wordEntries}
          onQuit={endSession}
          id={id}
          loading={isLoading}
        />
      )}

      {ui == 'cloudDisplay' && !!cloud && (
        <CloudDisplay
          cloud={cloud}
          wordCount={wordCount}
          onRestart={endSession}
          restartText={restartText}
        />
      )}

      {ui == 'error' && (
        <ErrorScreen message={errorMessage} onReset={endSession} />
      )}
    </>
  );
}
