import { heuristicTextEngine } from './engines/heuristicTextEngine';
import { ExtractInput, ExtractResult, ResumeExtractionEngine } from './types';

const ENGINES: ResumeExtractionEngine[] = [heuristicTextEngine];

export const getExtractionEngines = (): ResumeExtractionEngine[] => ENGINES;

export const extractResume = (input: ExtractInput): ExtractResult => {
  const engine = ENGINES.find((item) => item.canHandle(input)) ?? ENGINES[0];
  return engine.extract(input);
};
