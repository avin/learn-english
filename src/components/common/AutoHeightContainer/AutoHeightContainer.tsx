import React, { useRef } from 'react';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  bottomSpace?: number;
}

function AutoHeightContainer({ className, style, bottomSpace = 20, children, ...props }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);
  const prevClientHeightRef = useRef(0);

  useEffectOnce(() => {
    const element = elementRef.current!;

    const updateHeight = () => {
      const rect = element.getBoundingClientRect();
      const updatedHeight = window.innerHeight - rect.top - bottomSpace;
      element.style.height = `${updatedHeight}px`;
    };

    const checkScrollState = () => {
      const { scrollHeight } = element;

      const prevClientHeight = prevClientHeightRef.current;
      prevClientHeightRef.current = scrollHeight;

      if (scrollHeight < prevClientHeight) {
        element.scrollTop = 0;
        checkScrollState();
        return;
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          checkScrollState();
        }
      });
    });

    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    updateHeight();

    window.addEventListener('resize', updateHeight);
    element.addEventListener('scroll', checkScrollState);

    return () => {
      window.removeEventListener('resize', updateHeight);
      element.removeEventListener('scroll', checkScrollState);
      observer.disconnect();
    };
  });

  return (
    <div className={cn(className)} ref={elementRef} {...props} style={{ ...style }}>
      {children}
    </div>
  );
}

export default AutoHeightContainer;
