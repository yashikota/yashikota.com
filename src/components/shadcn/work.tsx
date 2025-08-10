import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GitHubLogoIcon, Link2Icon } from "@radix-ui/react-icons";

interface WorkComponentProps {
  thumbnail: string;
  title: string;
  date: string;
  description: string;
  github: string[];
  tags: string[];
  url: string[];
  path: string;
}

export function WorkComponent(props: WorkComponentProps) {
  return (
    <Card className="flex flex-col hover:bg-gray-100 transition-colors">
      <a href={`/works/${props.path}`}>
        <CardContent className="p-1 flex justify-center">
          <img
            src={props.thumbnail}
            alt={props.title}
            className="max-h-[40vh] w-auto object-contain"
          />
        </CardContent>
      </a>
      <CardHeader className="pt-2 pb-1">
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm text-muted-foreground">
            {props.date}
          </CardDescription>
          <div className="flex">
            {props.github.map((github) => (
              <a
                key={github}
                href={github}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-gray-400 mr-2"
              >
                <GitHubLogoIcon width="20" height="20" />
              </a>
            ))}
            {props.url.map((url) => (
              <a
                key={url}
                href={`${url}/?source=works`}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-gray-400 mr-2"
              >
                <Link2Icon width="20" height="20" />
              </a>
            ))}
          </div>
        </div>
        <CardTitle className="text-lg">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <a href={`/works/${props.path}`}>
          <CardDescription className="text-sm text-muted-foreground">
            {props.description}
          </CardDescription>
        </a>
        <CardDescription className="flex items-center flex-wrap mt-2">
          {props.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm mr-2 text-sky-400 hover:text-sky-700"
            >
              #{tag}
            </span>
          ))}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
