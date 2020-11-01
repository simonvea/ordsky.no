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

  describe('given state waiting', () => {
    it('when event is CREATE_CLOUD, createCloud service is triggered', () => {
      // Arrange
      const mockService = jest.fn();

      const mockSessionMachine = sessionMachine.withConfig({
        services: {
          listenforCloud: jest.fn(),
          listenToWords: jest.fn(),
          createCloud: mockService,
        },
      });

      const sessionService = interpret(mockSessionMachine).start();

      // Get state to 'waiting'
      sessionService.send({ type: 'START_SESSION' });
      sessionService.send({ type: 'WORDS_ADDED' });

      // Act
      sessionService.send({ type: 'CREATE_CLOUD' });

      // Assert
      expect(mockService).toHaveBeenCalled();
    });

    it('when event is CLOUD_CREATED, addCloudToContext action is triggered', () => {
      // Arrange
      const mockAction = jest.fn();

      const mockSessionMachine = sessionMachine.withConfig({
        actions: {
          addCloudToContext: mockAction,
        },
        services: {
          listenforCloud: jest.fn(),
          listenToWords: jest.fn(),
          createCloud: jest.fn(),
        },
      });

      const sessionService = interpret(mockSessionMachine).start();

      // Get state to 'waiting'
      sessionService.send({ type: 'START_SESSION' });
      sessionService.send({ type: 'WORDS_ADDED' });

      // Act
      sessionService.send({ type: 'CLOUD_CREATED' });

      // Assert
      expect(mockAction).toHaveBeenCalled();
    });
  });
});
