import { CSSProperties, ChangeEvent, useEffect, useRef, useState } from 'react';
import EditorPanel from './components/business/EditorPanel';
import PreviewPanel from './components/business/PreviewPanel';
import TopToolbar from './components/business/TopToolbar';
import SettingsModal from './components/business/SettingsModal';
import { TEMPLATE_REGISTRY } from './components/business/PreviewPanel/templates/templateRegistry';
import { createDefaultResume } from './data/defaultResume';
import { ThemeType, TemplateType, UiTheme } from './types/resume';
import {
  LocalExtendedConfig,
  createDefaultExtendedConfig,
  loadPersistedState,
  savePersistedState,
} from './utils/persistence';
import { isResumeData } from './utils/resumeValidation';

const createDefaultState = () => ({
  resume: createDefaultResume(),
  template: 'classic' as TemplateType,
  theme: 'ocean' as ThemeType,
  uiTheme: 'light' as UiTheme,
  fontScale: 1,
  blockGapScale: 1,
  innerGapScale: 1,
  localConfig: createDefaultExtendedConfig(),
});

const App = () => {
  const initialStateRef = useRef(createDefaultState());
  const initialState = initialStateRef.current;

  const [resume, setResume] = useState(initialState.resume);
  const [template, setTemplate] = useState<TemplateType>(initialState.template);
  const [theme, setTheme] = useState<ThemeType>(initialState.theme);
  const [uiTheme, setUiTheme] = useState<UiTheme>(initialState.uiTheme);
  const [fontScale, setFontScale] = useState(initialState.fontScale);
  const [blockGapScale, setBlockGapScale] = useState(initialState.blockGapScale);
  const [innerGapScale, setInnerGapScale] = useState(initialState.innerGapScale);
  const [localConfig, setLocalConfig] = useState<LocalExtendedConfig>(initialState.localConfig);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let disposed = false;

    const hydrate = async () => {
      const persisted = await loadPersistedState();
      if (disposed) return;

      if (persisted) {
        setResume(persisted.resume);
        setTemplate(persisted.template);
        setTheme(persisted.theme);
        setUiTheme(persisted.uiTheme);
        setFontScale(persisted.fontScale);
        setBlockGapScale(persisted.blockGapScale);
        setInnerGapScale(persisted.innerGapScale);
        setLocalConfig({
          pageSettings: persisted.pageSettings,
          pluginSettings: persisted.pluginSettings,
          pageConfigs: persisted.pageConfigs,
        });
      }

      setHydrated(true);
    };

    void hydrate();

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    void savePersistedState({
      resume,
      template,
      theme,
      uiTheme,
      fontScale,
      blockGapScale,
      innerGapScale,
      pageSettings: localConfig.pageSettings,
      pluginSettings: localConfig.pluginSettings,
      pageConfigs: localConfig.pageConfigs,
    });
  }, [resume, template, theme, uiTheme, fontScale, blockGapScale, innerGapScale, localConfig, hydrated]);

  useEffect(() => {
    document.body.classList.toggle('dark-body', uiTheme === 'dark');
    return () => document.body.classList.remove('dark-body');
  }, [uiTheme]);

  const exportJson = () => {
    const payload = JSON.stringify(resume, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `resume-${stamp}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const onImportFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;

      if (!isResumeData(parsed)) {
        window.alert('JSON 结构不符合当前简历模型，请检查后重试。');
        return;
      }

      setResume(parsed);
    } catch {
      window.alert('导入失败：文件内容不是有效 JSON。');
    } finally {
      event.target.value = '';
    }
  };

  const appStyle = {
    '--font-scale': fontScale.toString(),
    '--block-gap-scale': blockGapScale.toString(),
    '--inner-gap-scale': innerGapScale.toString(),
  } as CSSProperties;

  return (
    <div className={`app app-ui-${uiTheme}`} style={appStyle}>
      <TopToolbar uiTheme={uiTheme} onUiThemeChange={setUiTheme} onOpenSettings={() => setSettingsOpen(true)} />
      <SettingsModal
        open={settingsOpen}
        template={template}
        templateOptions={TEMPLATE_REGISTRY.map(({ id, label }) => ({ id, label }))}
        theme={theme}
        fontScale={fontScale}
        blockGapScale={blockGapScale}
        innerGapScale={innerGapScale}
        onClose={() => setSettingsOpen(false)}
        onTemplateChange={setTemplate}
        onThemeChange={setTheme}
        onFontScaleChange={setFontScale}
        onBlockGapScaleChange={setBlockGapScale}
        onInnerGapScaleChange={setInnerGapScale}
        onPrint={() => window.print()}
        onExportJson={exportJson}
        onImportJson={() => importInputRef.current?.click()}
      />

      <input
        ref={importInputRef}
        className="hidden-input"
        type="file"
        accept="application/json"
        onChange={onImportFileChange}
      />

      <main className="workspace">
        <aside className="left-pane no-print">
          <EditorPanel value={resume} onChange={setResume} />
        </aside>
        <section className="right-pane">
          <PreviewPanel resume={resume} template={template} theme={theme} />
        </section>
      </main>
    </div>
  );
};

export default App;
