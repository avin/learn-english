import React from 'react';
import cn from 'clsx';

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  intent: 'danger' | 'primary';
}

const Button = ({ className, intent, ...props }: Props) => {
  return (
    <button
      className={cn(
        'rounded px-2 py-1 text-xs font-semibold text-white shadow-sm ',
        {
          'bg-blue2 hover:bg-blue3': intent === 'primary',
          'bg-red2 hover:bg-red3': intent === 'danger',
        },
        className,
      )}
      type="button"
      {...props}
    />
  );
};

export default Button;
