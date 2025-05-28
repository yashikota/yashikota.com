import type React from "react";
import { useEffect } from "react";

type Props = {
  html: string;
};

export const Blog: React.FC<Props> = ({ html }) => {
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("copy-link-btn")) {
        const parent = target.closest("h1, h2, h3, h4, h5, h6");
        if (parent?.id) {
          const url = `${window.location.origin}${window.location.pathname}#${parent.id}`;
          navigator.clipboard.writeText(url);
          target.setAttribute("data-copied", "true");
          target.setAttribute("aria-label", "リンクをコピーしました");
          setTimeout(() => {
            target.removeAttribute("data-copied");
            target.setAttribute("aria-label", "この見出しへのリンクをコピー");
          }, 1200);
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div
      className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};
