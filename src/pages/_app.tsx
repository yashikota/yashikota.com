import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import "zenn-content-css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("zenn-embed-elements");
  }, []);

  return (
    <>
      <Head>
        <title>Garakuta Okiba</title>
        <meta name="description" content="Garakuta Okiba" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/icon.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
