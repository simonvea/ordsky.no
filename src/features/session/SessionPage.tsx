import React from 'react';
import { useMachine } from '@xstate/react';
import { StartSession } from './StartSession';
import { WaitScreen } from './WaitScreen';
import { sessionMachine } from './StateMachine';
import { WordsInput } from './WordsInput';
import { CloudDisplay } from './CloudDisplay';

export const SessionPage: React.FC = () => {
  const [state, send] = useMachine(sessionMachine);
  const { isAdmin, wordEntries, id, cloud } = state.context;

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

  switch (state.value) {
    case 'idle':
      return (
        <StartSession
          onNewSession={onNewSession}
          onJoinSession={onJoinSession}
        />
      );
    case 'wordsInput':
      return <WordsInput id={id} onSubmit={onSubmitWords} />;
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
      if (!cloud)
        return (
          <span>Oups! Noe gikk galt når jeg forsøkte å hente ordskyen.</span>
        );
      return <CloudDisplay cloud={cloud} onRestart={restart} />;
    default:
      return (
        <>
          <StartSession
            onNewSession={onNewSession}
            onJoinSession={onJoinSession}
          />
          <button type="button" onClick={restart}>
            Kill
          </button>
        </>
      );
  }
};
