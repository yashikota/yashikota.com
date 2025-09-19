import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GitHubLogoIcon, Link2Icon } from "@radix-ui/react-icons";
import type { WorkItem } from "@/lib/works";

interface WorkModalProps {
  work: WorkItem;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkModal({ work, isOpen, onClose }: WorkModalProps) {
  const [content, setContent] = useState<string>(work.description);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && work) {
      setIsLoading(true);
      // クライアントサイドでmarkdownコンテンツを取得
      const loadContent = async () => {
        try {
          // まずは基本の説明を表示
          setContent(work.description);
          // TODO: 必要に応じて詳細なマークダウンコンテンツを取得する処理を追加
        } catch (error) {
          console.error("Failed to load work content:", error);
          setContent(work.description);
        } finally {
          setIsLoading(false);
        }
      };
      loadContent();
    }
  }, [isOpen, work]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center">
            <div className="flex items-center justify-center text-lg text-muted-foreground mb-2">
              {work.date}
            </div>
            <DialogTitle className="scroll-m-20 text-2xl font-extrabold lg:text-4xl mb-4">
              {work.title}
            </DialogTitle>

            {/* GitHub and URL links */}
            <div className="flex flex-col items-center justify-center mb-4">
              {work.github.map((githubUrl) => (
                <a
                  key={githubUrl}
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center mx-2 my-1 hover:text-gray-400"
                >
                  <GitHubLogoIcon width="24" height="24" />
                  <span className="ml-2 text-sky-400 hover:text-sky-600">{githubUrl}</span>
                </a>
              ))}
              {work.url.map((urlLink) => (
                <a
                  key={urlLink}
                  href={`${urlLink}/?source=works`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center hover:text-gray-400 mx-2 my-1"
                >
                  <Link2Icon width="24" height="24" />
                  <span className="ml-2 text-sky-400 hover:text-sky-600">{urlLink}</span>
                </a>
              ))}
            </div>

            {/* Tags */}
            <div className="flex items-center justify-center flex-wrap mb-4">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="mx-1 text-sky-400 hover:text-sky-700 text-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="border-b border-gray-500 mb-5"></div>

        {/* Work image */}
        <div className="w-full mb-8 flex justify-center">
          <img
            src={work.image}
            alt={work.title}
            className="max-h-[50vh] w-auto object-contain"
          />
        </div>

        {/* Work content */}
        <div className="w-full max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">読み込み中...</div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <p className="text-muted-foreground">{content}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
