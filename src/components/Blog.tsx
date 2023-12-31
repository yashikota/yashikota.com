import { useEffect } from "react";

type Props = {
    html: string
}

export const Blog: React.FC<Props> = ({ html }) => {
    useEffect(() => {
        import("zenn-embed-elements");
    }, []);

    return (
        <div
            className="znc"
            dangerouslySetInnerHTML={{
                __html: html,
            }}
        />
    )
}
