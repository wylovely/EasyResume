interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

const Field = ({ label, value, onChange, multiline, placeholder }: FieldProps) => (
  <label className="field">
    <span>{label}</span>
    {multiline ? (
      <textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} rows={4} />
    ) : (
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    )}
  </label>
);

export default Field;
