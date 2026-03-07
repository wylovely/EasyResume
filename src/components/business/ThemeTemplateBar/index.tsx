import { ThemeType, TemplateType } from '../../../types/resume';

interface ThemeTemplateBarProps {
  template: TemplateType;
  templateOptions: Array<{ id: TemplateType; label: string }>;
  theme: ThemeType;
  fontScale: number;
  blockGapScale: number;
  innerGapScale: number;
  onTemplateChange: (template: TemplateType) => void;
  onThemeChange: (theme: ThemeType) => void;
  onFontScaleChange: (value: number) => void;
  onBlockGapScaleChange: (value: number) => void;
  onInnerGapScaleChange: (value: number) => void;
  onPrint: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
}

const ThemeTemplateBar = ({
  template,
  templateOptions,
  theme,
  fontScale,
  blockGapScale,
  innerGapScale,
  onTemplateChange,
  onThemeChange,
  onFontScaleChange,
  onBlockGapScaleChange,
  onInnerGapScaleChange,
  onPrint,
  onExportJson,
  onImportJson,
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
    <label className="slider-label">
      字号
      <input
        type="range"
        min={0.8}
        max={1.2}
        step={0.05}
        value={fontScale}
        onChange={(event) => onFontScaleChange(Number(event.target.value))}
      />
      <span>{Math.round(fontScale * 100)}%</span>
    </label>
    <label className="slider-label">
      块间距
      <input
        type="range"
        min={0.8}
        max={1.2}
        step={0.05}
        value={blockGapScale}
        onChange={(event) => onBlockGapScaleChange(Number(event.target.value))}
      />
      <span>{Math.round(blockGapScale * 100)}%</span>
    </label>
    <label className="slider-label">
      块内间距
      <input
        type="range"
        min={0.8}
        max={1.2}
        step={0.05}
        value={innerGapScale}
        onChange={(event) => onInnerGapScaleChange(Number(event.target.value))}
      />
      <span>{Math.round(innerGapScale * 100)}%</span>
    </label>
    <button type="button" onClick={onPrint}>
      导出 PDF（浏览器打印）
    </button>
    <button type="button" onClick={onExportJson}>
      导出 JSON
    </button>
    <button type="button" onClick={onImportJson}>
      导入 JSON
    </button>
  </div>
);

export default ThemeTemplateBar;
