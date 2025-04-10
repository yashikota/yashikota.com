import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SlideComponentProps {
  thumbnail: string;
  title: string;
  pubDate: string;
  tags: string[];
  url: string;
}

export function SlideComponent(props: SlideComponentProps) {
  return (
    <Card className="h-full flex flex-col hover:bg-gray-100 transition-colors">
      <a href={props.url} className="flex-grow">
        <CardContent className="p-1 flex justify-center">
          <img
            src={props.thumbnail}
            alt={props.title}
            className="max-h-[40vh] w-auto object-contain"
          />
        </CardContent>
      </a>
      <CardHeader className="pt-2 pb-1">
        <CardDescription className="text-sm text-muted-foreground">
          {props.pubDate}
        </CardDescription>
        <CardTitle className="text-lg">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <CardDescription className="flex items-center flex-wrap">
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
