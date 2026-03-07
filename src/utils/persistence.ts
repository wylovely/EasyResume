import { invoke } from '@tauri-apps/api/core';
import { ResumeData, ThemeType, TemplateType, UiTheme } from '../types/resume';
import { isResumeData } from './resumeValidation';

export interface LocalExtendedConfig {
  pageSettings: Record<string, unknown>;
  pluginSettings: Record<string, unknown>;
  pageConfigs: Record<string, unknown>;
}

export interface PersistedState extends LocalExtendedConfig {
  resume: ResumeData;
  template: TemplateType;
  theme: ThemeType;
  uiTheme: UiTheme;
  fontScale: number;
  blockGapScale: number;
  innerGapScale: number;
}

const TEMPLATE_SET: TemplateType[] = ['classic', 'modern', 'compact'];
const THEME_SET: ThemeType[] = ['ocean', 'forest', 'sunset'];
const UI_THEME_SET: UiTheme[] = ['light', 'dark'];

const isTemplateType = (value: unknown): value is TemplateType =>
  typeof value === 'string' && TEMPLATE_SET.includes(value as TemplateType);

const isThemeType = (value: unknown): value is ThemeType =>
  typeof value === 'string' && THEME_SET.includes(value as ThemeType);

const isUiTheme = (value: unknown): value is UiTheme =>
  typeof value === 'string' && UI_THEME_SET.includes(value as UiTheme);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeScale = (value: unknown): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1;
  return Math.max(0.8, Math.min(1.2, value));
};

const normalizeRecord = (value: unknown): Record<string, unknown> => (isRecord(value) ? value : {});

const isTauriRuntime = (): boolean =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const createDefaultExtendedConfig = (): LocalExtendedConfig => ({
  pageSettings: {},
  pluginSettings: {},
  pageConfigs: {},
});

const normalizePersistedState = (record: Record<string, unknown>): PersistedState | null => {
  if (!isResumeData(record.resume)) return null;
  if (!isTemplateType(record.template)) return null;
  if (!isThemeType(record.theme)) return null;
  const uiTheme = isUiTheme(record.uiTheme) ? record.uiTheme : 'light';

  return {
    resume: record.resume,
    template: record.template,
    theme: record.theme,
    uiTheme,
    // Backward compatibility for previous frontend-only storage schema.
    fontScale: normalizeScale(record.fontScale ?? record.uiScale),
    blockGapScale: normalizeScale(record.blockGapScale ?? record.spaceScale ?? record.uiScale),
    innerGapScale: normalizeScale(record.innerGapScale ?? record.spaceScale ?? record.uiScale),
    pageSettings: normalizeRecord(record.pageSettings),
    pluginSettings: normalizeRecord(record.pluginSettings),
    pageConfigs: normalizeRecord(record.pageConfigs),
  };
};

export const loadPersistedState = async (): Promise<PersistedState | null> => {
  if (!isTauriRuntime()) return null;

  try {
    const raw = await invoke<string | null>('load_local_state');
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;

    return normalizePersistedState(parsed);
  } catch {
    return null;
  }
};

export const savePersistedState = async (state: PersistedState): Promise<void> => {
  if (!isTauriRuntime()) return;

  await invoke('save_local_state', {
    content: JSON.stringify(state),
  });
};
