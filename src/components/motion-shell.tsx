"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MotionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    root.dataset.motion = "ready";

    const reveal = () => {
      const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
      if (reducedMotion.matches) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return () => undefined;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8%", threshold: 0.12 },
      );
      elements.forEach((element) => observer.observe(element));
      return () => observer.disconnect();
    };

    const stopReveal = reveal();
    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty(
        "--scroll-progress",
        `${scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0}`,
      );
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      stopReveal();
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <>
      <div className="pointer-aura" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <div key={pathname} className="route-frame">
        {children}
      </div>
    </>
  );
}
