import React from 'react';
import cn from 'clsx';

interface Props extends Omit<React.ComponentPropsWithoutRef<'label'>, 'onChange'> {
  label: React.ReactNode;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  value?: string;
}

const Select = ({ label, options, value, onChange, className, ...props }: Props) => {
  return (
    <label className={cn('flex items-center space-x-2', className)} {...props}>
      <span>{label}:</span>
      <select
        id="location"
        name="location"
        className="block w-full rounded-md border-0 py-1.5 pl-2 pr-10 ring-1 ring-inset ring-gray3"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Select;
