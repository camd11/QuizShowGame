import OpenAI from "openai";
import fs from 'fs/promises';
import path from 'path';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ConversationEntry {
  module: string;
  timestamp: string;
  messages: Message[];
  response: string;
}

interface MasterLog {
  project_start_time: string;
  conversations: {
    [key: string]: ConversationEntry[];
  };
}

export class AIClient {
  private client: OpenAI;
  private conversationHistory: { [key: string]: Message[] };
  private conversationLogDir: string;
  private masterLogPath: string;
  private moduleName: string;
  private masterLog!: MasterLog;

  static async create(moduleName: string): Promise<AIClient> {
    const client = new AIClient(moduleName);
    await client.initialize();
    return client;
  }

  private constructor(moduleName: string) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Quiz-Show-Game"
      }
    });

    this.moduleName = moduleName;
    this.conversationHistory = {};
    this.conversationLogDir = 'logs/conversations';
    this.masterLogPath = 'logs/master_conversation_log.json';
  }

  private async initialize(): Promise<void> {
    this.masterLog = await this._loadOrCreateMasterLog();
  }

  private async _loadOrCreateMasterLog(): Promise<MasterLog> {
    try {
      await fs.mkdir(path.dirname(this.masterLogPath), { recursive: true });
      try {
        const data = await fs.readFile(this.masterLogPath, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        // File doesn't exist or is invalid, create new log
        const newLog: MasterLog = {
          project_start_time: new Date().toISOString(),
          conversations: {}
        };
        await fs.writeFile(this.masterLogPath, JSON.stringify(newLog, null, 2));
        return newLog;
      }
    } catch (error) {
      console.error('Error loading/creating master log:', error);
      throw error;
    }
  }

  private async _logConversation(conversationId: string, messages: Message[], response: string) {
    try {
      const timestamp = new Date().toISOString();
      const conversationEntry: ConversationEntry = {
        module: this.moduleName,
        timestamp,
        messages,
        response
      };

      // Ensure conversation log directory exists
      await fs.mkdir(this.conversationLogDir, { recursive: true });

      // Save individual conversation log
      const logPath = path.join(
        this.conversationLogDir,
        `conversation_${conversationId}_${timestamp.replace(/[:.]/g, '-')}.json`
      );
      await fs.writeFile(logPath, JSON.stringify(conversationEntry, null, 2));

      // Update master log
      if (!this.masterLog.conversations[conversationId]) {
        this.masterLog.conversations[conversationId] = [];
      }
      this.masterLog.conversations[conversationId].push(conversationEntry);
      await fs.writeFile(this.masterLogPath, JSON.stringify(this.masterLog, null, 2));
    } catch (error) {
      console.error('Error logging conversation:', error);
      throw error;
    }
  }

  async get_completion(messages: Message[], conversationId?: string, temperature: number = 0.7): Promise<string> {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array must not be empty');
    }
    try {
      const conversationMessages = conversationId && this.conversationHistory[conversationId] 
        ? [...this.conversationHistory[conversationId], ...messages]
        : messages;

      const completion = await this.client.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet:beta",
        messages: conversationMessages,
        temperature,
        max_tokens: 1000
      });

      const content = completion.choices[0].message.content || '';

      if (conversationId) {
        if (!this.conversationHistory[conversationId]) {
          this.conversationHistory[conversationId] = [];
        }
        this.conversationHistory[conversationId].push(
          messages[messages.length - 1],
          { role: "assistant" as const, content }
        );
      }

      this._logConversation(
        conversationId || "single_interaction",
        messages,
        content
      );

      return content;

    } catch (error) {
      console.error('Error getting completion:', error);
      throw error;
    }
  }

  startConversation(): string {
    const conversationId = new Date().toISOString();
    this.conversationHistory[conversationId] = [];
    return conversationId;
  }

  endConversation(conversationId: string): void {
    if (conversationId in this.conversationHistory) {
      this._logConversation(
        conversationId,
        this.conversationHistory[conversationId],
        "CONVERSATION_ENDED"
      );
      delete this.conversationHistory[conversationId];
    }
  }

  getConversationHistory(conversationId: string): Message[] {
    return this.conversationHistory[conversationId] || [];
  }

  clearConversationHistory(conversationId?: string): void {
    if (conversationId) {
      if (conversationId in this.conversationHistory) {
        this.conversationHistory[conversationId] = [];
      }
    } else {
      this.conversationHistory = {};
    }
  }
}
