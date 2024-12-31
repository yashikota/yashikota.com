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
    <Card className="lg:w-4/5 mx-auto my-5 hover:bg-gray-100">
      <a href={props.url}>
        <CardContent className="p-1">
          <img src={props.thumbnail} alt={props.title} />
        </CardContent>
      </a>
      <CardHeader>
        <CardDescription className="text-lg text-muted-foreground">
          {props.pubDate}
        </CardDescription>
        <CardTitle className="text-black">{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex items-center flex-wrap">
          {props.tags.map((tag, index) => (
            <span
              key={index}
              className="text-lg mr-2 text-sky-400 hover:text-sky-700"
            >
              #{tag}
            </span>
          ))}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
