import { ThemeType, TemplateType } from '../../../types/resume';

interface ThemeTemplateBarProps {
  template: TemplateType;
  templateOptions: Array<{ id: TemplateType; label: string }>;
  theme: ThemeType;
  onTemplateChange: (template: TemplateType) => void;
  onThemeChange: (theme: ThemeType) => void;
  onPrint: () => void;
}

const ThemeTemplateBar = ({
  template,
  templateOptions,
  theme,
  onTemplateChange,
  onThemeChange,
  onPrint,
}: ThemeTemplateBarProps) => (
  <div className="toolbar no-print">
    <label>
      模板
      <select value={template} onChange={(event) => onTemplateChange(event.target.value as TemplateType)}>
        {templateOptions.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
    <label>
      主题
      <select value={theme} onChange={(event) => onThemeChange(event.target.value as ThemeType)}>
        <option value="ocean">Ocean</option>
        <option value="forest">Forest</option>
        <option value="sunset">Sunset</option>
      </select>
    </label>
    <button type="button" onClick={onPrint}>
      导出 PDF（浏览器打印）
    </button>
  </div>
);

export default ThemeTemplateBar;
