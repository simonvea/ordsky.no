import { interpret } from 'xstate';
import { sessionMachine } from './StateMachine';
import {
  SessionContext,
  SessionEvent,
  SessionStateSchema,
} from './StateMachine.types';

describe('sessionMachine', () => {
  it('when event is ADD_WORDS, new state is waiting', () => {
    const expectedValue = 'waiting'; // the expected state value

    const actualState = sessionMachine.transition('wordsInput', {
      type: 'ADD_WORDS',
      words: ['one', 'two', 'three'],
    });

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

  it('when event is ADD_WORDS, sendWords action is triggered', () => {
    // Arrange
    let wordsSendt = false;

    const mockSessionMachine = sessionMachine.withConfig({
      actions: {
        sendWords: () => {
          wordsSendt = true;
        },
      },
      services: {
        listenToWords: jest.fn(),
        listenforCloud: jest.fn(),
      },
    });

    const fetchService = interpret<
      SessionContext,
      SessionStateSchema,
      SessionEvent
    >(mockSessionMachine).start();

    fetchService.send({ type: 'JOIN_SESSION', id: 'huh' });

    // Act
    fetchService.send({ type: 'ADD_WORDS', words: ['one', 'two', 'three'] });

    // Assert
    expect(wordsSendt).toBe(true);
  });

  it('when event is START_SESSION, setAsAdmin action is triggered', () => {
    let adminEvent = false;

    const mockSessionMachine = sessionMachine.withConfig({
      actions: {
        setAsAdmin: () => {
          adminEvent = true;
        },
      },
    });

    const fetchService = interpret(mockSessionMachine).start();

    fetchService.send({ type: 'START_SESSION' });

    expect(adminEvent).toBe(true);
  });

  it('when generateID, sets context isAdmin to true', () => {
    const actualState = sessionMachine.transition('idle', 'START_SESSION');

    expect(actualState.context.isAdmin).toBeTruthy();
  });

  it('when generateID, sets context id', () => {
    const actualState = sessionMachine.transition('idle', 'START_SESSION');

    expect(actualState.context.id).toBeTruthy();
  });

  it('when event is START_SESSION, new state is waiting', () => {
    const expectedValue = 'waiting'; // the expected state value

    const actualState = sessionMachine.transition('idle', 'START_SESSION');

    expect(actualState.matches(expectedValue)).toBeTruthy();
  });
});
