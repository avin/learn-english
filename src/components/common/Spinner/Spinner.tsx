import React, { useLayoutEffect, useRef } from 'react';
import cn from 'clsx';
import styles from './Spinner.module.css';

interface Props {
  size?: number;
  color?: string;
  thickness?: string;
  className?: string;
}

const Spinner = ({ size = 80, color, className, thickness }: Props): JSX.Element => {
  const elRef = useRef<HTMLDivElement>(null);
  const frameId = useRef<number | null>(null);

  useLayoutEffect(() => {
    const duration = 700;

    const rotateSpinner = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime;
      const rotation = ((elapsedTime / duration) * 360) % 360;
      if (elRef.current) {
        elRef.current.style.transform = `rotate(${rotation}deg)`;
      }
      frameId.current = requestAnimationFrame(rotateSpinner);
    };
    frameId.current = requestAnimationFrame(rotateSpinner);

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(styles.spinner, className)}
      ref={elRef}
      style={{
        width: size,
        height: size,
        color,
        borderWidth: thickness,
      }}
    />
  );
};

export default Spinner;
