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
}

export function WorkComponent(props: WorkComponentProps) {
    return (
        <Card className="lg:w-4/5 mx-auto my-5 hover:bg-gray-100">
            <a
                href={
                    props.url[0] ? `${props.url[0]}/?source=works` : undefined
                }
                target="_blank"
                rel="noopener"
            >
                {" "}
                <CardContent className="p-1 flex justify-center">
                    <img src={props.thumbnail} alt={props.title} />
                </CardContent>
            </a>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardDescription className="text-lg text-muted-foreground">
                        {props.date}
                    </CardDescription>
                    <div className="flex">
                        {props.github.map((github, index) => (
                            <a
                                key={index}
                                href={github}
                                target="_blank"
                                rel="noopener"
                                className="hover:text-gray-400 mr-2"
                            >
                                <GitHubLogoIcon width="25" height="25" />
                            </a>
                        ))}
                        {props.url.map((url, index) => (
                            <a
                                key={index}
                                href={`${url}/?source=works`}
                                target="_blank"
                                rel="noopener"
                                className="hover:text-gray-400 mr-2"
                            >
                                <Link2Icon width="25" height="25" />
                            </a>
                        ))}
                    </div>
                </div>
                <CardTitle className="text-black">{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-lg text-muted-foreground">
                    {props.description}
                </CardDescription>
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
