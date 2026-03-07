import { ResumeExtractionEngine } from '../types';
import { buildResumeFromText } from '../utils/heuristics';

export const heuristicTextEngine: ResumeExtractionEngine = {
  id: 'heuristic-text-v1',
  displayName: 'Heuristic Text Extractor',
  canHandle: (input) => input.rawText.trim().length > 0,
  extract: (input) => ({
    resume: buildResumeFromText(input.rawText),
    metadata: {
      engineId: 'heuristic-text-v1',
      confidence: 0.45,
      notes: [
        `Source: ${input.sourceName}`,
        'Heuristic extraction only. Please review and adjust fields manually.',
      ],
    },
  }),
};
