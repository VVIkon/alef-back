import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import type { IMessage } from '../ws/interfaces/websocket-message.interface';

@Injectable()
export class OllamaService {
	private ollama: Ollama | null = null;

	constructor(
		private readonly configService: ConfigService,
	) {
		this.ollama = new Ollama({
			host: configService.get<string>('OLLAMA_URL', 'http://localhost:11434')
		});
	}

	public async handleOllama(data: IMessage): Promise<string | null> {
    try {
		if(!this.ollama || !data?.message)
			return null;
      const stream = await this.ollama.generate({
        model: 'llama3',
        prompt: data.message,
        stream: true,
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk.response;
      }
	  return fullResponse;
    } catch (error) {
      console.error('Ollama error:', error);
	  return null
    }
  }
}
