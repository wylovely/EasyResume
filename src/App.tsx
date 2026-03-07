import { useState } from 'react';
import EditorPanel from './components/business/EditorPanel';
import PreviewPanel from './components/business/PreviewPanel';
import ThemeTemplateBar from './components/business/ThemeTemplateBar';
import { createDefaultResume } from './data/defaultResume';
import { ThemeType, TemplateType } from './types/resume';

const App = () => {
  const [resume, setResume] = useState(createDefaultResume);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [theme, setTheme] = useState<ThemeType>('ocean');

  return (
    <div className="app">
      <ThemeTemplateBar
        template={template}
        theme={theme}
        onTemplateChange={setTemplate}
        onThemeChange={setTheme}
        onPrint={() => window.print()}
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
