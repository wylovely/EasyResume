import { ResumeData, ThemeType, TemplateType } from '../../../types/resume';
import { getTemplatePlugin } from './templates/templateRegistry';

interface PreviewPanelProps {
  resume: ResumeData;
  template: TemplateType;
  theme: ThemeType;
}

const PreviewPanel = ({ resume, template, theme }: PreviewPanelProps) => {
  const templatePlugin = getTemplatePlugin(template);

  return <div className={`preview-shell template-${template} theme-${theme}`}>{templatePlugin.render({ resume })}</div>;
};

export default PreviewPanel;
