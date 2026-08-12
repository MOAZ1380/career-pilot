import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { RESUME_OPTIMIZER_PROMPT } from './prompt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileServices: ProfileService,
  ) {}

  private readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  async optimizeResume(userId: string, jobDescription: string) {
    const myProfile = await this.profileServices.findMe(userId);
    if (!myProfile) {
      throw new Error('Profile not found');
    }

    const prompt = RESUME_OPTIMIZER_PROMPT.replace(
      '{{JOB_DESCRIPTION}}',
      jobDescription,
    ).replace('{{PROFILE}}', JSON.stringify(myProfile, null, 2));

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      const text = response.text;

      if (!text) {
        throw new Error('AI returned an empty response.');
      }

      const cleaned = text
        .replace(/^```json/, '')
        .replace(/^```/, '')
        .replace(/```$/, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }
}
