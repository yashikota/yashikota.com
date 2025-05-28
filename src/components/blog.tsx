import { ArrowUp } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

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

  // トップに戻るボタンの表示制御
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
      {showTop && (
        <button
          type="button"
          aria-label="トップに戻る"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed z-50 bottom-6 right-6 bg-sky-500 hover:bg-sky-700 text-white rounded-full shadow-lg p-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <ArrowUp className="w-6 h-6 inline align-middle" />
        </button>
      )}
    </>
  );
};
