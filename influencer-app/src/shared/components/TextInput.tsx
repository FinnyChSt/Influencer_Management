export interface TextInputProps {
  label: string;
  placeholder?: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

function TextInput({
  label,
  placeholder,
  id,
  value,
  onChange,
  onBlur,
  required,
}: TextInputProps) {
  return (
    <div>
      <label htmlFor={id} className="flex text-sm font-medium text-white mb-1">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default TextInput;
