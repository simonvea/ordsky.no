import React, { useState } from 'react';
import { StartSession } from './components/StartSession';
import { WaitScreen } from './components/WaitScreen';
import { ErrorScreen } from '../../common/molecules/ErrorScreen';
import { CloudDisplay } from '../../common/organisms/CloudDisplay';
import { WordsInput } from '../../common/molecules/WordsInput';
import { useSession } from './state/useSession';
import { WarningModal } from '../../common/molecules/WarningModal';
import { useCallToAction } from '../../common/hooks/useCallToAction';

export function CollaborativePage(): React.ReactElement {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const { shouldDisplayCallToAction } = useCallToAction({
    shouldShowOnFirstVisit: true,
  });

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

  const handleQuit = (): void => {
    if (isAdmin && wordEntries > 0) {
      setShowWarningModal(true);
    } else {
      endSession();
    }
  };

  const onCloseModal = (): void => {
    setShowWarningModal(false);
  };

  const onConfirmCloseModal = (): void => {
    setShowWarningModal(false);
    endSession();
  };

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
          onQuit={handleQuit}
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
          shouldDisplayCallToAction={isAdmin && shouldDisplayCallToAction}
        />
      )}

      {ui == 'error' && (
        <ErrorScreen message={errorMessage} onReset={endSession} />
      )}

      <WarningModal
        isOpen={showWarningModal}
        onClose={onCloseModal}
        onConfirm={onConfirmCloseModal}
        title="Er du sikker?"
        message="Er du sikker på at du vil avslutte økten? Du vil miste muligheten til å skape ordsky av ordene som er sendt inn."
      />
    </>
  );
}
