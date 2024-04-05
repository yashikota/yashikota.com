import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface CardComponentProps {
    thumbnail: string;
    title: string;
    pubDate: string;
    tags: string[];
    url: string;
}

export function ImageCardComponent(props: CardComponentProps) {
    return (
        <Card className="lg:w-4/5 mx-auto my-5">
            <a href={props.url}>
                <CardContent className="p-1">
                    <img src={props.thumbnail} alt={props.title} />
                </CardContent>
                <CardDescription className="flex items-center">
                    <CardHeader>
                        <CardDescription className="text-lg text-muted-foreground">
                            {props.pubDate}
                        </CardDescription>
                        <CardTitle>{props.title}</CardTitle>
                        {props.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="mr-2 text-sky-400 hover:text-sky-700"
                            >
                                #{tag}
                            </span>
                        ))}
                    </CardHeader>
                </CardDescription>
            </a>
        </Card>
    );
}
