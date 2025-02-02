export interface Message {
  role: string;
  content: string;
}

export class AIClient {
  private client: any;
  private logger: any;
  private extraHeaders: { [key: string]: string };
  private conversationHistory: { [key: string]: Message[] };
  private conversationLogDir: string;
  private masterLogPath: string;
  private masterLog: any;
  private moduleName: string;

  constructor(moduleName: string) {
    this.client = {
      chat: {
        completions: {
          create: async (params: any) => {
            // Mock implementation for now
            const response = {
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      text: "What is the capital of France?",
                      options: ["London", "Berlin", "Paris", "Madrid"],
                      correctAnswer: 2,
                      explanation: "Paris is the capital and largest city of France."
                    })
                  }
                }
              ]
            };
            return response;
          }
        }
      }
    };

    this.moduleName = moduleName;
    this.extraHeaders = {
      "HTTP-Referer": "http://localhost",
      "X-Title": "Quiz-Show-Game",
    };
    this.conversationHistory = {};
    this.conversationLogDir = 'logs/conversations';
    this.masterLogPath = 'logs/master_conversation_log.json';
    this.masterLog = this._loadOrCreateMasterLog();
  }

  private _loadOrCreateMasterLog() {
    return {
      project_start_time: new Date().toISOString(),
      conversations: {}
    };
  }

  private _logConversation(conversationId: string, messages: Message[], response: string) {
    const timestamp = new Date().toISOString();
    const conversationEntry = {
      module: this.moduleName,
      timestamp,
      messages,
      response
    };

    if (!this.masterLog.conversations[conversationId]) {
      this.masterLog.conversations[conversationId] = [];
    }
    this.masterLog.conversations[conversationId].push(conversationEntry);
  }

  async get_completion(messages: Message[], conversationId?: string, temperature: number = 0.7): Promise<string> {
    try {
      const conversationMessages = conversationId && this.conversationHistory[conversationId] 
        ? [...this.conversationHistory[conversationId], ...messages]
        : messages;

      const completion = await this.client.chat.completions.create({
        extra_headers: this.extraHeaders,
        model: "deepseek/deepseek-r1",
        messages: conversationMessages,
        temperature
      });

      const response = completion.choices[0].message.content;

      if (conversationId) {
        if (!this.conversationHistory[conversationId]) {
          this.conversationHistory[conversationId] = [];
        }
        this.conversationHistory[conversationId].push(
          messages[messages.length - 1],
          { role: "assistant", content: response }
        );
      }

      this._logConversation(
        conversationId || "single_interaction",
        messages,
        response
      );

      return response;

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
