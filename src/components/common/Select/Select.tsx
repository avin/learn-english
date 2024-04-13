import React, { useMemo } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import cn from 'clsx';

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  label: React.ReactNode;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  value?: string;
  selectMinWidth?: string;
  disabled?: boolean;
}

const Select = ({
  label,
  options,
  value,
  onChange,
  className,
  selectMinWidth,
  disabled,
  ...props
}: Props) => {
  const handleClickSwitch = (direction: number) => {
    const activeOptionIndex = options.findIndex((i) => i.value === value);
    const nextOption = options[activeOptionIndex + direction];
    if (nextOption) {
      onChange(nextOption.value);
    }
  };

  const [canSelectLeft, canSelectRight] = useMemo(() => {
    const activeOptionIndex = options.findIndex((i) => i.value === value);
    const nextOption = options[activeOptionIndex + 1];
    const prevOption = options[activeOptionIndex - 1];

    return [!!prevOption, !!nextOption];
  }, [options, value]);

  return (
    <div className={cn('flex items-center', className)} {...props}>
      <div className="mr-2">{label}:</div>
      <div className="flex h-[32px] w-full rounded-md border-0 bg-white ring-1 ring-inset ring-gray3">
        <button
          type="button"
          onClick={() => handleClickSwitch(-1)}
          className="h-full px-1 text-gray1 disabled:opacity-50"
          disabled={!canSelectLeft || disabled}
        >
          <HiChevronLeft size={24} />
        </button>

        <select
          id="location"
          name="location"
          className="block w-full border-0 px-2 text-center ring-1 ring-inset ring-gray3"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          style={{ minWidth: selectMinWidth }}
          disabled={disabled}
        >
          {options.map(({ label, value }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => handleClickSwitch(+1)}
          className="h-full px-1 text-gray1 disabled:opacity-50"
          disabled={!canSelectRight || disabled}
        >
          <HiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Select;
