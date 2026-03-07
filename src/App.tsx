import { CSSProperties, ChangeEvent, useEffect, useRef, useState } from 'react';
import EditorPanel from './components/business/EditorPanel';
import PreviewPanel from './components/business/PreviewPanel';
import PdfPreviewModal from './components/business/PdfPreviewModal';
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
import { importResumeFromPdf } from './extraction/pdfImporter';

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

const getStringSetting = (source: Record<string, unknown>, key: string): string | null => {
  const value = source[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
};

const sanitizeFilePart = (value: string): string =>
  value
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '')
    .slice(0, 30);

const buildResumeFileBaseName = (
  basics: { name: string; phone: string; role: string },
  fallbackDate: string
): string => {
  const parts = [sanitizeFilePart(basics.name), sanitizeFilePart(basics.phone), sanitizeFilePart(basics.role)].filter(
    Boolean
  );
  return parts.length ? parts.join('-') : `resume-${fallbackDate}`;
};

const PDF_SOFT_BREAK_CLASS = 'pdf-soft-break-before';

const applyPdfSoftBreaks = (target: HTMLElement): void => {
  const paperRect = target.getBoundingClientRect();
  const pageHeightPx = (paperRect.width * 277) / 190;
  const reservePx = 34; // around 1-2 text lines

  const candidates = Array.from(
    target.querySelectorAll<HTMLElement>('.resume-section, .work-item, .project-item')
  );

  candidates.forEach((item, index) => {
    item.classList.remove(PDF_SOFT_BREAK_CLASS);
    if (index === 0) return;

    const top = item.getBoundingClientRect().top - paperRect.top;
    const topInPage = top % pageHeightPx;
    if (topInPage > pageHeightPx - reservePx) {
      item.classList.add(PDF_SOFT_BREAK_CLASS);
    }
  });
};

const clearPdfSoftBreaks = (target: HTMLElement): void => {
  target
    .querySelectorAll<HTMLElement>(`.${PDF_SOFT_BREAK_CLASS}`)
    .forEach((item) => item.classList.remove(PDF_SOFT_BREAK_CLASS));
};

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
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfPreviewLoading, setPdfPreviewLoading] = useState(false);
  const [pdfSaving, setPdfSaving] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfPreviewBlob, setPdfPreviewBlob] = useState<Blob | null>(null);
  const [pdfPreviewError, setPdfPreviewError] = useState<string | null>(null);
  const [pdfImporting, setPdfImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const importPdfInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const exportJson = () => {
    const payload = JSON.stringify(resume, null, 2);
    const stamp = new Date().toISOString().slice(0, 10);
    const baseName = buildResumeFileBaseName(resume.basics, stamp);
    const defaultFileName = `${baseName}.json`;

    if (!(typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window)) {
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = defaultFileName;
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }

    void (async () => {
      try {
        const { save } = await import('@tauri-apps/plugin-dialog');
        const { invoke } = await import('@tauri-apps/api/core');
        const { documentDir, join } = await import('@tauri-apps/api/path');
        const lastPath = getStringSetting(localConfig.pageSettings, 'lastJsonSavePath');
        const defaultPath = lastPath ?? (await join(await documentDir(), defaultFileName));
        const selectedPath = await save({
          title: '保存 JSON',
          defaultPath,
          filters: [{ name: 'JSON', extensions: ['json'] }],
        });

        if (!selectedPath) return;

        await invoke('save_text_file', { path: selectedPath, content: payload });
        setLocalConfig((current) => ({
          ...current,
          pageSettings: {
            ...current.pageSettings,
            lastJsonSavePath: selectedPath,
          },
        }));
      } catch {
        window.alert('导出 JSON 失败，请重试。');
      }
    })();
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

  const onImportPdfFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPdfImporting(true);
    try {
      const result = await importResumeFromPdf(file);
      setResume(result.resume);
      window.alert(`PDF 导入完成（引擎: ${result.metadata.engineId}）。请检查并修正识别结果。`);
    } catch {
      window.alert('PDF 导入失败：无法提取有效内容，请尝试更清晰的 PDF 或后续接入 OCR。');
    } finally {
      setPdfImporting(false);
      event.target.value = '';
    }
  };

  const openPdfPreview = async () => {
    const target = document.getElementById('resume-paper');
    if (!target) {
      window.alert('未找到简历预览区域，无法生成 PDF。');
      return;
    }

    setPdfPreviewOpen(true);
    setPdfPreviewLoading(true);
    setPdfPreviewError(null);

    const tempClasses = [`template-${template}`, `theme-${theme}`, 'pdf-exporting'];
    tempClasses.forEach((className) => target.classList.add(className));

    const prevFontScale = target.style.getPropertyValue('--font-scale');
    const prevBlockGapScale = target.style.getPropertyValue('--block-gap-scale');
    const prevInnerGapScale = target.style.getPropertyValue('--inner-gap-scale');
    const prevAccent = target.style.getPropertyValue('--accent');
    const prevText = target.style.getPropertyValue('--text');
    const prevMuted = target.style.getPropertyValue('--muted');
    const prevColor = target.style.color;

    target.style.setProperty('--font-scale', String(fontScale));
    target.style.setProperty('--block-gap-scale', String(blockGapScale));
    target.style.setProperty('--inner-gap-scale', String(innerGapScale));
    target.style.setProperty('--accent', getComputedStyle(target).getPropertyValue('--accent').trim() || '#0284c7');
    target.style.setProperty('--text', '#1f2937');
    target.style.setProperty('--muted', '#6b7280');
    target.style.color = '#1f2937';
    applyPdfSoftBreaks(target);

    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const stamp = new Date().toISOString().slice(0, 10);
      const pdfOptions = {
        margin: [10, 10, 10, 10],
        filename: `${buildResumeFileBaseName(resume.basics, stamp)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css'] },
      };
      const worker = html2pdf()
        .set(pdfOptions as any)
        .from(target)
        .toPdf();

      const blob = (await worker.outputPdf('blob')) as Blob;
      const nextUrl = URL.createObjectURL(blob);
      setPdfPreviewBlob(blob);

      setPdfPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextUrl;
      });
    } catch {
      setPdfPreviewError('PDF 生成失败，请重试。');
    } finally {
      tempClasses.forEach((className) => target.classList.remove(className));
      clearPdfSoftBreaks(target);

      if (prevFontScale) target.style.setProperty('--font-scale', prevFontScale);
      else target.style.removeProperty('--font-scale');
      if (prevBlockGapScale) target.style.setProperty('--block-gap-scale', prevBlockGapScale);
      else target.style.removeProperty('--block-gap-scale');
      if (prevInnerGapScale) target.style.setProperty('--inner-gap-scale', prevInnerGapScale);
      else target.style.removeProperty('--inner-gap-scale');
      if (prevAccent) target.style.setProperty('--accent', prevAccent);
      else target.style.removeProperty('--accent');
      if (prevText) target.style.setProperty('--text', prevText);
      else target.style.removeProperty('--text');
      if (prevMuted) target.style.setProperty('--muted', prevMuted);
      else target.style.removeProperty('--muted');
      target.style.color = prevColor;

      setPdfPreviewLoading(false);
    }
  };

  const savePdfToLocal = async () => {
    if (!pdfPreviewBlob) {
      window.alert('请先生成预览 PDF。');
      return;
    }

    if (!(typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window)) {
      const url = URL.createObjectURL(pdfPreviewBlob);
      const anchor = document.createElement('a');
      anchor.href = url;
      const stamp = new Date().toISOString().slice(0, 10);
      anchor.download = `${buildResumeFileBaseName(resume.basics, stamp)}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }

    setPdfSaving(true);
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      const { invoke } = await import('@tauri-apps/api/core');
      const { documentDir, join } = await import('@tauri-apps/api/path');
      const stamp = new Date().toISOString().slice(0, 10);
      const defaultFileName = `${buildResumeFileBaseName(resume.basics, stamp)}.pdf`;
      const lastPath = getStringSetting(localConfig.pageSettings, 'lastPdfSavePath');
      const defaultPath = lastPath ?? (await join(await documentDir(), defaultFileName));
      const selectedPath = await save({
        title: '保存 PDF',
        defaultPath,
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      });

      if (!selectedPath) return;

      const bytes = Array.from(new Uint8Array(await pdfPreviewBlob.arrayBuffer()));
      await invoke('save_pdf_file', { path: selectedPath, bytes });
      setLocalConfig((current) => ({
        ...current,
        pageSettings: {
          ...current.pageSettings,
          lastPdfSavePath: selectedPath,
        },
      }));
    } catch {
      window.alert('保存失败，请重试。');
    } finally {
      setPdfSaving(false);
    }
  };

  const appStyle = {
    '--font-scale': fontScale.toString(),
    '--block-gap-scale': blockGapScale.toString(),
    '--inner-gap-scale': innerGapScale.toString(),
  } as CSSProperties;

  return (
    <div className={`app app-ui-${uiTheme}`} style={appStyle}>
      <TopToolbar
        uiTheme={uiTheme}
        onUiThemeChange={setUiTheme}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenPreview={() => {
          void openPdfPreview();
        }}
      />
      <PdfPreviewModal
        open={pdfPreviewOpen}
        loading={pdfPreviewLoading}
        saving={pdfSaving}
        pdfUrl={pdfPreviewUrl}
        error={pdfPreviewError}
        onClose={() => setPdfPreviewOpen(false)}
        onRefresh={() => {
          void openPdfPreview();
        }}
        onSave={() => {
          void savePdfToLocal();
        }}
      />
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
        onExportJson={exportJson}
        onImportJson={() => importInputRef.current?.click()}
        onImportPdf={() => {
          if (pdfImporting) return;
          importPdfInputRef.current?.click();
        }}
      />

      <input
        ref={importInputRef}
        className="hidden-input"
        type="file"
        accept="application/json"
        onChange={onImportFileChange}
      />
      <input
        ref={importPdfInputRef}
        className="hidden-input"
        type="file"
        accept="application/pdf"
        onChange={onImportPdfFileChange}
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
