"use client";

import { FC, useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  className?: string;
}

const Lottie: FC<Props> = ({ src, className = "w-full" }) => {
  const [isPlayerLoaded, setPlayerLoaded] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("@dotlottie/player-component").then((mod) => {
      setPlayerLoaded(true);
      return mod.default;
    });
  }, []);

  useEffect(() => {
    const currentContainer = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        rootMargin: "100px 0px",
      }
    );

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`${className} h-full`}>
      {isPlayerLoaded && isVisible ? (
        <dotlottie-player className="w-full h-full" src={src} autoplay loop />
      ) : (
        <div
          role="status"
          className="flex items-center justify-center max-w-lg bg-slate-300 rounded-lg animate-pulse h-full"
        >
          <svg
            className="w-10 h-10 text-slate-200 dark:text-slate-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Lottie;
