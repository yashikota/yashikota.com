import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface CardComponentProps {
    title: string
    pubDate: string
    updDate: string | null
    tags: string[]
    icon: string
}

export function CardComponent(props: CardComponentProps) {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <img src={props.icon} alt="" className="w-8 h-8" />
                <CardDescription>
                    {props.updDate ? `${props.pubDate} (${props.updDate})` : props.pubDate}
                </CardDescription>
                <CardTitle>{props.title}</CardTitle>
            </CardHeader>
            <CardContent>{props.tags}</CardContent>
        </Card>
    )
}
