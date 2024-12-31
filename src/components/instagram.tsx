import { useEffect } from "react";

interface InstagramEmbedProps {
  postId: string;
}

export function InstagramEmbedComponent({ postId }: InstagramEmbedProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    const scriptCallback = () => {
      (window as any).instgrm.Embeds.process();
    };

    script.onload = scriptCallback;

    return () => {
      document.body.removeChild(script);
    };
  }, [postId]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={`https://www.instagram.com/p/${postId}`}
      style={{ maxWidth: "550px", width: "100%" }}
    />
  );
}
