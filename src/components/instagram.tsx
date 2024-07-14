type InstagramEmbedProps = {
    postId: string;
};

export function InstagramEmbedComponent({ postId }: InstagramEmbedProps) {
    return (
        <>
            <script async src="//www.instagram.com/embed.js"></script>

            <blockquote
                className="instagram-media"
                data-instgrm-permalink={`https://www.instagram.com/p/${postId}`}
                style={{ maxWidth: "540px", width: "100%" }}
            ></blockquote>
        </>
    );
}
