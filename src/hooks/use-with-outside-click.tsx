import { useEffect, useRef, useState, MutableRefObject } from 'react';

interface UseOutsideClickProps {
  ref: MutableRefObject<HTMLElement | null>;
  onOutsideClick: () => void;
}

const useOutsideClick = ({ ref, onOutsideClick }: UseOutsideClickProps) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onOutsideClick();
    }
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      handleClickOutside(event);
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, onOutsideClick]);
};

export default useOutsideClick;
