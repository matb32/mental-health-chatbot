'use client';

interface RadioOption {
  value: number;
  label: string;
}

interface RadioGroupProps {
  question: string;
  examples?: string;
  options: RadioOption[];
  value: number | undefined;
  onChange: (value: number) => void;
  name: string;
}

export default function RadioGroup({
  question,
  examples,
  options,
  value,
  onChange,
  name,
}: RadioGroupProps) {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <legend className="text-lg font-medium text-gray-900 mb-2">
        {question}
      </legend>
      {examples && (
        <p className="text-sm text-gray-600 italic mb-4">{examples}</p>
      )}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`radio-card ${
              value === option.value ? 'border-primary-600 bg-primary-50' : 'border-gray-300'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <div className="radio-indicator mr-3" />
            <span className="flex-1 text-sm font-medium text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
