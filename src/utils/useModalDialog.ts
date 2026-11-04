import { MouseEvent, PointerEvent, useEffect, useRef } from 'react';

const isOutsideDialog = (event: MouseEvent<HTMLDialogElement>) => {
  const dialog = event.currentTarget;
  const { left, right, top, bottom } = dialog.getBoundingClientRect();
  return (
    event.target === dialog &&
    (event.clientX < left ||
      event.clientX >= right ||
      event.clientY < top ||
      event.clientY >= bottom)
  );
};

export const useModalDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const startedOutside = useRef(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    startedOutside.current = isOutsideDialog(event);
  };

  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (startedOutside.current && isOutsideDialog(event)) event.currentTarget.close();
    startedOutside.current = false;
  };

  return { dialogRef, onPointerDown, onClick };
};
