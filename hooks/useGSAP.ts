"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGSAP() {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    contextRef.current = gsap.context(() => {});
    return () => {
      contextRef.current?.revert();
    };
  }, []);

  return { gsap, ScrollTrigger };
}

export function useScrollAnimation(
  ref: React.RefObject<HTMLElement>,
  options: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    scrollTrigger?: ScrollTrigger.Vars;
  }
) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!, options.from || { opacity: 0, y: 40 }, {
        ...(options.to || { opacity: 1, y: 0 }),
        scrollTrigger: {
          trigger: ref.current!,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none none",
          ...options.scrollTrigger,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, options]);
}
