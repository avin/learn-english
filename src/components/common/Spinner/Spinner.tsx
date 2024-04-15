import React from 'react';
import cn from 'clsx';
import styles from './Spinner.module.css';

interface Props {
  size?: number;
  color?: string;
  thickness?: string;
  className?: string;
}

const Spinner = ({ size = 80, color, className, thickness }: Props): JSX.Element => {
  return (
    <div
      className={cn(styles.spinner, className)}
      style={{ width: size, height: size, color, borderWidth: thickness }}
    />
  );
};

export default Spinner;
