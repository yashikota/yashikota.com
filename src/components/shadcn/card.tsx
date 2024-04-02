import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { UpdateIcon } from "@radix-ui/react-icons";

interface CardComponentProps {
    title: string;
    pubDate: string;
    updDate: string | null;
    tags: string[];
    icon: string;
    slug: string;
    url: string;
}

export function CardComponent(props: CardComponentProps) {
    return (
        <Card className="w-[90%]">
            <CardHeader>
                <a
                    href={props.slug ? `/blog/${props.slug}` : props.url}
                    target={props.slug ? "" : "_blank"}
                    rel={props.slug ? "" : "noopener"}
                >
                    <div className="flex items-center">
                        <img
                            src={props.icon}
                            alt="favicon"
                            className="w-6 h-6 mr-2"
                        />
                        <CardDescription className="flex items-center">
                            {props.pubDate}{" "}
                            {props.updDate && (
                                <>
                                    <UpdateIcon className="ml-2" />
                                    {props.updDate}
                                </>
                            )}
                        </CardDescription>
                    </div>
                    <CardTitle className="ml-1 mt-1">{props.title}</CardTitle>
                </a>
            </CardHeader>
            <CardContent className="ml-0.3">
                {props.tags.map((tag, index) => (
                    <span
                        key={index}
                        className="mr-2 text-sky-400 hover:text-sky-700"
                    >
                        #{tag}
                    </span>
                ))}
            </CardContent>
        </Card>
    );
}
