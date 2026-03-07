import { UiTheme } from '../../../types/resume';

interface TopToolbarProps {
  uiTheme: UiTheme;
  onUiThemeChange: (value: UiTheme) => void;
  onOpenSettings: () => void;
  onOpenPreview: () => void;
}

const TopToolbar = ({ uiTheme, onUiThemeChange, onOpenSettings, onOpenPreview }: TopToolbarProps) => (
  <div className="toolbar no-print">
    <label>
      主题
      <select value={uiTheme} onChange={(event) => onUiThemeChange(event.target.value as UiTheme)}>
        <option value="light">亮色</option>
        <option value="dark">暗色</option>
      </select>
    </label>
    <div className="toolbar-right">
      <button type="button" onClick={onOpenPreview}>
        PDF预览
      </button>
      <button type="button" onClick={onOpenSettings}>
        设置
      </button>
    </div>
  </div>
);

export default TopToolbar;
