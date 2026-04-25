import { ArrowUp } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

type Props = {
  html: string;
};

type LinkPreview = {
  title?: unknown;
  description?: unknown;
  favicon?: unknown;
  ogImage?: unknown;
};

const getPreviewText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const setImageSource = (image: HTMLImageElement | null, src: string) => {
  if (!image || !src) {
    return;
  }

  image.src = src;
  image.hidden = false;
};

const applyLinkPreview = (card: HTMLElement, preview: LinkPreview) => {
  const title = getPreviewText(preview.title);
  const description = getPreviewText(preview.description);
  const favicon = getPreviewText(preview.favicon);
  const ogImage = getPreviewText(preview.ogImage);

  const titleElement = card.querySelector<HTMLElement>(
    "[data-link-card-title]",
  );
  if (titleElement && title) {
    titleElement.textContent = title;
  }

  const descriptionElement = card.querySelector<HTMLElement>(
    "[data-link-card-description]",
  );
  if (descriptionElement) {
    descriptionElement.textContent = description;
  }

  setImageSource(
    card.querySelector<HTMLImageElement>("[data-link-card-favicon]"),
    favicon,
  );

  setImageSource(
    card.querySelector<HTMLImageElement>("[data-link-card-image]"),
    ogImage,
  );

  const thumbnail = card.querySelector<HTMLElement>(
    "[data-link-card-thumbnail]",
  );
  if (thumbnail && ogImage) {
    thumbnail.hidden = false;
  }
};

export const Blog: React.FC<Props> = ({ html }) => {
  const contentRef = useRef<HTMLDivElement>(null);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Link card DOM is recreated when the rendered HTML changes.
  useEffect(() => {
    const root = contentRef.current;
    if (!root) {
      return;
    }

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-link-card-url]"),
    );
    if (cards.length === 0) {
      return;
    }

    const cardsByUrl = new Map<string, HTMLElement[]>();
    for (const card of cards) {
      const url = card.dataset.linkCardUrl;
      if (!url) {
        continue;
      }

      const cardsForUrl = cardsByUrl.get(url) ?? [];
      cardsForUrl.push(card);
      cardsByUrl.set(url, cardsForUrl);
    }

    let cancelled = false;

    const loadPreview = async (url: string) => {
      try {
        const previewUrl = new URL("/api/preview", window.location.origin);
        previewUrl.searchParams.set("url", url);

        const response = await fetch(previewUrl);
        if (!response.ok) {
          return;
        }

        const preview = (await response.json()) as LinkPreview;
        if (cancelled) {
          return;
        }

        for (const card of cardsByUrl.get(url) ?? []) {
          applyLinkPreview(card, preview);
        }
      } catch {
        // Keep the build-time fallback card if preview loading fails.
      }
    };

    for (const url of cardsByUrl.keys()) {
      void loadPreview(url);
    }

    return () => {
      cancelled = true;
    };
  }, [html]);

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
        ref={contentRef}
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
