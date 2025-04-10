import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdateIcon } from "@radix-ui/react-icons";

interface BlogCardComponentProps {
  title: string;
  pubDate: string;
  updDate: string | null;
  tags: string[];
  icon: string;
  slug: string;
  url: string;
}

export function BlogCardComponent(props: BlogCardComponentProps) {
  return (
    <Card className="my-3 hover:bg-gray-100">
      <CardHeader>
        <a
          href={props.slug ? `/blog/${props.slug}` : props.url}
          target={props.slug ? "" : "_blank"}
          rel={props.slug ? "" : "noopener"}
        >
          <div className="flex items-center">
            <img src={props.icon} alt="favicon" className="w-6 h-6 mr-2" />
            <CardDescription className="flex items-center">
              {props.pubDate}{" "}
              {props.updDate && (
                <>
                  <UpdateIcon className="ml-2 mr-0.5 h-3" />
                  {props.updDate}
                </>
              )}
            </CardDescription>
          </div>
          <CardTitle className="ml-1 mt-1">{props.title}</CardTitle>
        </a>
      </CardHeader>
      <CardContent>
        {props.tags.map((tag, index) => (
          <a
            key={`${props.slug || props.url}-${tag}-${index}`}
            href={`https://yashikota.com/blog/tags/${tag.toLocaleLowerCase()}/`}
          >
            <span className="mr-2 text-sky-400 hover:text-sky-700">#{tag}</span>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
