import { ThemeType, TemplateType } from '../../../types/resume';

interface ResumeVersionItem {
  id: string;
  label: string;
  createdAt: string;
}

interface SettingsModalProps {
  open: boolean;
  template: TemplateType;
  templateOptions: Array<{ id: TemplateType; label: string }>;
  theme: ThemeType;
  fontScale: number;
  blockGapScale: number;
  innerGapScale: number;
  onClose: () => void;
  onTemplateChange: (template: TemplateType) => void;
  onThemeChange: (theme: ThemeType) => void;
  onFontScaleChange: (value: number) => void;
  onBlockGapScaleChange: (value: number) => void;
  onInnerGapScaleChange: (value: number) => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onImportPdf: () => void;
  versions: ResumeVersionItem[];
  onSaveVersion: () => void;
  onApplyVersion: (id: string) => void;
  onRestoreDefault: () => void;
}

const SettingsModal = ({
  open,
  template,
  templateOptions,
  theme,
  fontScale,
  blockGapScale,
  innerGapScale,
  onClose,
  onTemplateChange,
  onThemeChange,
  onFontScaleChange,
  onBlockGapScaleChange,
  onInnerGapScaleChange,
  onExportJson,
  onImportJson,
  onImportPdf,
  versions,
  onSaveVersion,
  onApplyVersion,
  onRestoreDefault,
}: SettingsModalProps) => {
  if (!open) return null;

  return (
    <div className="settings-modal-mask no-print" onClick={onClose} role="presentation">
      <section className="settings-modal" onClick={(event) => event.stopPropagation()}>
        <header className="settings-modal-header">
          <h3>设置</h3>
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </header>

        <div className="settings-modal-body">
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
            简历主题
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

          <div className="settings-actions">
            <button type="button" onClick={onExportJson}>
              导出 JSON
            </button>
            <button type="button" onClick={onImportJson}>
              导入 JSON
            </button>
            <button type="button" onClick={onImportPdf}>
              从 PDF 导入
            </button>
          </div>

          <div className="version-section">
            <div className="settings-actions">
              <button type="button" onClick={onSaveVersion}>
                保存数据版本
              </button>
              <button type="button" onClick={onRestoreDefault}>
                恢复默认（无名模板）
              </button>
            </div>

            <div className="version-list">
              {versions.length === 0 && <p className="tip">暂无历史版本</p>}
              {versions.map((item) => (
                <div className="version-row" key={item.id}>
                  <div>
                    <strong>{item.label}</strong>
                    <p className="muted">{item.createdAt}</p>
                  </div>
                  <button type="button" onClick={() => onApplyVersion(item.id)}>
                    应用
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsModal;
