import React from 'react';
import { useMachine } from '@xstate/react';
import { StartSession } from './StartSession';
import { WaitScreen } from './WaitScreen';
import { sessionMachine } from './StateMachine';

export const SessionPage: React.FC = () => {
  const [state, send] = useMachine(sessionMachine);
  const { isAdmin, wordEntries, id } = state.context;

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

  switch (state.value) {
    case 'idle':
      return (
        <StartSession
          onNewSession={onNewSession}
          onJoinSession={onJoinSession}
        />
      );
    case 'waiting':
      return (
        <WaitScreen
          isAdmin={isAdmin}
          onCreateWordCloud={onCreateCloud}
          numberOfEntries={wordEntries}
          onQuit={restart}
          id={id}
        />
      );
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
