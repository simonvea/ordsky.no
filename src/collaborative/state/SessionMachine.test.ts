import { createActor, fromPromise, getNextSnapshot } from 'xstate';
import { sessionMachine } from './SessionMachine';

describe('sessionMachine', () => {
  it("should start in the 'idle' state", () => {
    const fetchService = createActor(sessionMachine).start();
    expect(fetchService.getSnapshot().value).toBe('idle');
  });

  it("should transition to 'startSession' on 'START_SESSION' event", () => {
    const fetchService = createActor(sessionMachine).start();
    fetchService.send({ type: 'START_SESSION' });
    expect(fetchService.getSnapshot().value).toBe('startSession');
  });

  it("should transition to 'wordsInput' on 'JOIN_SESSION' event", () => {
    // Arrange
    const mockSessionMachine = sessionMachine.provide({
      actors: {
        checkSession: fromPromise<void, { id: string }>(() =>
          Promise.resolve()
        ),
      },
    });

    const fetchService = createActor(mockSessionMachine).start();

    // Act
    fetchService.send({ type: 'JOIN_SESSION', id: '123' });

    // Assert
    expect(fetchService.getSnapshot().value).toBe('wordsInput');
  });

  it("should transition to 'rejoining' on 'REJOIN_SESSION' event", () => {
    // Arrange
    const mockSessionMachine = sessionMachine.provide({
      actors: {
        checkSession: fromPromise<void, { id: string }>(() =>
          Promise.resolve()
        ),
      },
    });
    const fetchService = createActor(mockSessionMachine).start();

    // Act
    fetchService.send({ type: 'REJOIN_SESSION', id: '123' });

    // Assert
    expect(fetchService.getSnapshot().value).toBe('rejoining');
  });

  describe('Given wordsInput state', () => {
    it("should transition to 'addWords' on 'ADD_WORDS' event with non-empty words", () => {
      // Arrange
      const mockSessionMachine = sessionMachine.provide({
        actors: { sendWords: jest.fn() as any },
      });

      const addInputState = getNextSnapshot(
        mockSessionMachine,
        mockSessionMachine.resolveState({
          value: 'wordsInput',
          context: { id: '123', isAdmin: false, wordEntries: 0 },
        }),
        { type: 'ADD_WORDS', words: ['word1', 'word2'] }
      );

      // Assert
      expect(addInputState.value).toBe('addWords');
    });
  });

  describe('Given waiting state', () => {
    it("should transition to 'creating' on 'CREATE_CLOUD' event", () => {
      const nextSnapshot = getNextSnapshot(
        sessionMachine,
        sessionMachine.resolveState({
          value: 'waiting',
          context: { id: '123', isAdmin: true, wordEntries: 0 },
        }),
        { type: 'CREATE_CLOUD' }
      );

      expect(nextSnapshot.value).toBe('creating');
    });

    it("should transition to 'created' on 'CLOUD_CREATED' event", () => {
      const nextSnapshot = getNextSnapshot(
        sessionMachine,
        sessionMachine.resolveState({
          value: 'waiting',
          context: { id: '123', isAdmin: true, wordEntries: 0 },
        }),
        {
          type: 'CLOUD_CREATED',
          cloud: [],
          wordCount: [{ text: 'a', count: 2 }],
        }
      );

      expect(nextSnapshot.value).toBe('created');
    });
  });
});
