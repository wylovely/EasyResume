import { ResumeData, ThemeType, TemplateType } from '../types/resume';
import { isResumeData } from './resumeValidation';

interface PersistedState {
  resume: ResumeData;
  template: TemplateType;
  theme: ThemeType;
}

const STORAGE_KEY = 'resume-builder-state-v1';

const TEMPLATE_SET: TemplateType[] = ['classic', 'modern', 'compact'];
const THEME_SET: ThemeType[] = ['ocean', 'forest', 'sunset'];

const isTemplateType = (value: unknown): value is TemplateType =>
  typeof value === 'string' && TEMPLATE_SET.includes(value as TemplateType);

const isThemeType = (value: unknown): value is ThemeType =>
  typeof value === 'string' && THEME_SET.includes(value as ThemeType);

export const loadPersistedState = (): PersistedState | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return null;

    const record = parsed as Record<string, unknown>;
    if (!isResumeData(record.resume)) return null;
    if (!isTemplateType(record.template)) return null;
    if (!isThemeType(record.theme)) return null;

    return {
      resume: record.resume,
      template: record.template,
      theme: record.theme,
    };
  } catch {
    return null;
  }
};

export const savePersistedState = (state: PersistedState): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
