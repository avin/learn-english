import React from 'react';
import cn from 'clsx';

interface Props extends React.ComponentPropsWithoutRef<'button'> {}

const Button = ({ className, ...props }: Props) => {
  return <button className={cn(className)} type="button" {...props} />;
};

export default Button;
