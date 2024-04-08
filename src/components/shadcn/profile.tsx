export function ProfileComponent() {
    return (
        <div className="flex flex-col items-center">
            <img src="/icon.webp" alt="avatar" className="w-24" />
            <h1 className="mt-4 text-2xl font-bold">
                <ruby>
                    kota<rt>こた</rt>
                </ruby>
            </h1>
            <p className="text-lg">(id: yashikota)</p>
            <div className="mt-2 h-1 w-40 bg-[#006e54]" />
            <div className="mt-4 flex space-x-2">
                <a
                    className="text-[#3182ce]"
                    href="https://github.com/yashikota"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
                <span>/</span>
                <a
                    className="text-[#3182ce]"
                    href="https://bsky.yashikota.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Bluesky
                </a>
                <span>/</span>
                <a
                    className="text-[#3182ce]"
                    href="https://twitter.com/yashikota"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Twitter
                </a>
                <span>/</span>
                <a
                    className="text-[#3182ce]"
                    href="https://zenn.dev/yashikota"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Zenn
                </a>
            </div>
            <p className="mt-4 text-center">
                低レイヤーやマルチメディア、3DCG、XRなど幅広く興味駆動開発で生きています。
            </p>
        </div>
    );
}
