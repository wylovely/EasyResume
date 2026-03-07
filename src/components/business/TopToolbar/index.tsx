import { UiTheme } from '../../../types/resume';

interface TopToolbarProps {
  uiTheme: UiTheme;
  onUiThemeChange: (value: UiTheme) => void;
  onOpenSettings: () => void;
}

const TopToolbar = ({ uiTheme, onUiThemeChange, onOpenSettings }: TopToolbarProps) => (
  <div className="toolbar no-print">
    <label>
      主题
      <select value={uiTheme} onChange={(event) => onUiThemeChange(event.target.value as UiTheme)}>
        <option value="light">亮色</option>
        <option value="dark">暗色</option>
      </select>
    </label>
    <button type="button" onClick={onOpenSettings}>
      设置
    </button>
  </div>
);

export default TopToolbar;
