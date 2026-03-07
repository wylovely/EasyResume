import { ResumeData } from '../types/resume';

export interface ExtractInput {
  rawText: string;
  sourceName: string;
}

export interface ExtractResult {
  resume: ResumeData;
  metadata: {
    engineId: string;
    confidence: number;
    notes: string[];
  };
}

export interface ResumeExtractionEngine {
  id: string;
  displayName: string;
  canHandle: (input: ExtractInput) => boolean;
  extract: (input: ExtractInput) => ExtractResult;
}
