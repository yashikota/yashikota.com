import type React from "react";

type Props = {
  html: string;
};

export const Blog: React.FC<Props> = ({ html }) => {
  return (
    <div
      className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};
