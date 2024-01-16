import { useCallback, useRef } from "react";

type FnType = (...args: any[]) => any;

const useDebounce = (fn: FnType, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );

  return debouncedFn;
};

export default useDebounce;
