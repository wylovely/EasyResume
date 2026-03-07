import { ChangeEvent, useRef, useState } from 'react';
import EditorPanel from './components/business/EditorPanel';
import PreviewPanel from './components/business/PreviewPanel';
import ThemeTemplateBar from './components/business/ThemeTemplateBar';
import { TEMPLATE_REGISTRY } from './components/business/PreviewPanel/templates/templateRegistry';
import { createDefaultResume } from './data/defaultResume';
import { ThemeType, TemplateType } from './types/resume';
import { isResumeData } from './utils/resumeValidation';

const App = () => {
  const [resume, setResume] = useState(createDefaultResume);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [theme, setTheme] = useState<ThemeType>('ocean');
  const importInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="app">
      <ThemeTemplateBar
        template={template}
        templateOptions={TEMPLATE_REGISTRY.map(({ id, label }) => ({ id, label }))}
        theme={theme}
        onTemplateChange={setTemplate}
        onThemeChange={setTheme}
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
