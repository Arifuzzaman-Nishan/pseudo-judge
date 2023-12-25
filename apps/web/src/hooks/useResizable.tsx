import { useState, useRef, useCallback, useEffect } from "react";

type Widths = {
  leftWidth: number;
  rightWidth: number;
};

type UseResizableType = {
  leftWidth?: number;
  rightWidth?: number;
  minWidth?: number;
  maxWidth?: number;
};

const useResizable = ({
  leftWidth = 58.3333,
  rightWidth = 41.6667,
  minWidth = 30,
  maxWidth = 80,
}: UseResizableType) => {
  const [widths, setWidths] = useState<Widths>({
    leftWidth: leftWidth,
    rightWidth: rightWidth,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef<boolean>(false);

  const onDrag = useCallback(
    (mouseMoveEvent: globalThis.MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;

      const containerWidth = containerRef.current.getBoundingClientRect().width;
      let leftWidth = (mouseMoveEvent.clientX / containerWidth) * 100;

      if (leftWidth < minWidth) {
        leftWidth = minWidth;
      } else if (leftWidth > maxWidth) {
        leftWidth = maxWidth;
      }

      const rightWidth = 100 - leftWidth;

      setWidths({
        leftWidth: leftWidth,
        rightWidth: rightWidth,
      });
    },
    [minWidth, maxWidth]
  );

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    window.removeEventListener("mousemove", onDrag as any);
    window.removeEventListener("mouseup", stopResizing);
  }, [onDrag]);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    window.addEventListener("mousemove", onDrag as any);
    window.addEventListener("mouseup", stopResizing);
  }, [onDrag, stopResizing]);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onDrag as any);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [onDrag, stopResizing]);

  return { widths, startResizing, containerRef };
};

export default useResizable;
