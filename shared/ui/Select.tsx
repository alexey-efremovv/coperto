import { useId, type ComponentProps } from 'react';

type SelectProps = ComponentProps<'select'> & {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
};

export function Select({ label, options, placeholder, error, ...props }: SelectProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-10 rounded-lg border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ink/15 ${error ? 'border-red-600' : 'border-ink/20'}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
