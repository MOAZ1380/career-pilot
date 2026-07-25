import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  async generateSummary() {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: 'Explain AI in one paragraph.',
      });

      console.log(response);

      return response.text;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
