// WebSocket API implementation using Durable Objects
// Simplified version for initial integration

// Type declarations for WebSocket messages
export interface WebSocketMessage {
  type: 'startSession' | 'saveWords' | 'getWords' | 'saveCloud' | 'rejoinSession';
  data?: any;
  sessionId?: string;
}

export interface SessionData {
  id: string;
  numberOfEntries: number;
  words: string[];
  cloud?: string;
  wordCount?: number;
  createdAt: number;
  expiresAt: number;
}

// Basic Durable Object implementation for WordCloudSession
export class WordCloudSession {
  private sessionId: string;
  private connections: Set<any>; // Using any to avoid WebSocket type issues
  private state: any;
  private env: any;

  constructor(state: any, env: any) {
    this.state = state;
    this.env = env;
    this.sessionId = "";
    this.connections = new Set();
    
    // Initialize storage on first use
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Create table for session data if it doesn't exist
      await this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS session_data (
          id TEXT PRIMARY KEY,
          numberOfEntries INTEGER DEFAULT 0,
          words TEXT DEFAULT '[]',
          cloud TEXT,
          wordCount INTEGER,
          createdAt INTEGER,
          expiresAt INTEGER
        )
      `);
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  private async getSessionData(sessionId: string): Promise<SessionData | null> {
    try {
      const result = await this.state.storage.sql.exec(
        "SELECT * FROM session_data WHERE id = ?",
        sessionId
      );
      
      if (result.results && result.results.length > 0) {
        const row = result.results[0];
        return {
          id: row.id,
          numberOfEntries: row.numberOfEntries,
          words: JSON.parse(row.words),
          cloud: row.cloud,
          wordCount: row.wordCount,
          createdAt: row.createdAt,
          expiresAt: row.expiresAt
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  }

  private async saveSessionData(sessionData: SessionData): Promise<void> {
    try {
      await this.state.storage.sql.exec(
        `INSERT OR REPLACE INTO session_data 
         (id, numberOfEntries, words, cloud, wordCount, createdAt, expiresAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        sessionData.id,
        sessionData.numberOfEntries,
        JSON.stringify(sessionData.words),
        sessionData.cloud,
        sessionData.wordCount,
        sessionData.createdAt,
        sessionData.expiresAt
      );
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle WebSocket upgrade
    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocketUpgrade(request);
    }
    
    // Handle HTTP requests to the Durable Object
    return new Response('Durable Object HTTP endpoint', { status: 200 });
  }

  private async handleWebSocketUpgrade(request: Request): Promise<Response> {
    try {
      // Extract session ID from URL or query params
      const url = new URL(request.url);
      const sessionId = url.searchParams.get('sessionId') || 'default';
      
      // Creates two ends of a WebSocket connection
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      // Accept the server-side WebSocket connection
      // This tells the runtime to begin terminating the request within the Durable Object
      server.accept();

      // Store the session ID and add connection to our tracking
      this.sessionId = sessionId;
      this.connections.add(server);

      // Set up message handler
      server.addEventListener('message', (event) => {
        this.handleWebSocketMessage(event, server);
      });

      // Handle connection close
      server.addEventListener('close', () => {
        this.connections.delete(server);
      });

      // Return the client-side WebSocket to complete the upgrade
      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    } catch (error) {
      console.error('Error handling WebSocket upgrade:', error);
      return new Response('WebSocket upgrade failed', { status: 500 });
    }
  }

  private async handleWebSocketMessage(event: any, websocket: any) {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'startSession':
          await this.handleStartSession(message, websocket);
          break;
        case 'saveWords':
          await this.handleSaveWords(message, websocket);
          break;
        case 'getWords':
          await this.handleGetWords(message, websocket);
          break;
        case 'saveCloud':
          await this.handleSaveCloud(message, websocket);
          break;
        default:
          websocket.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type'
          }));
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      websocket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  }

  private async handleStartSession(message: WebSocketMessage, websocket: any) {
    const sessionId = message.sessionId || this.generateSessionId();
    this.sessionId = sessionId;
    
    // Create or get session
    let sessionData = await this.getSessionData(sessionId);
    if (!sessionData) {
      sessionData = {
        id: sessionId,
        numberOfEntries: 0,
        words: [],
        createdAt: Date.now(),
        expiresAt: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
      };
      await this.saveSessionData(sessionData);
    }

    websocket.send(JSON.stringify({
      type: 'sessionStarted',
      sessionId: sessionId,
      data: sessionData
    }));
  }

  private async handleSaveWords(message: WebSocketMessage, websocket: any) {
    if (!this.sessionId) return;
    
    const sessionData = await this.getSessionData(this.sessionId);
    if (sessionData) {
      sessionData.words = sessionData.words.concat(message.data.words || []);
      sessionData.numberOfEntries += 1;
      await this.saveSessionData(sessionData);

      // Broadcast to all connections
      this.broadcast({
        type: 'wordsAdded',
        data: {
          words: sessionData.words,
          numberOfEntries: sessionData.numberOfEntries
        }
      });
    }
  }

  private async handleGetWords(message: WebSocketMessage, websocket: any) {
    if (!this.sessionId) return;
    
    const sessionData = await this.getSessionData(this.sessionId);
    websocket.send(JSON.stringify({
      type: 'sessionWords',
      data: sessionData
    }));
  }

  private async handleSaveCloud(message: WebSocketMessage, websocket: any) {
    if (!this.sessionId) return;
    
    const sessionData = await this.getSessionData(this.sessionId);
    if (sessionData) {
      sessionData.cloud = message.data.cloud;
      await this.saveSessionData(sessionData);

      // Broadcast to all connections
      this.broadcast({
        type: 'cloudCreated',
        data: { cloud: sessionData.cloud }
      });
    }
  }

  private broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    for (const connection of this.connections) {
      try {
        connection.send(messageStr);
      } catch (error) {
        // Remove broken connections
        this.connections.delete(connection);
      }
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
  }
}