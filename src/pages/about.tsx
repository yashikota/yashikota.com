import Head from "next/head";
import { useEffect, useState } from "react";
import markdownToHtml from "zenn-markdown-html";

const getData = async () => {
  const url = "https://raw.githubusercontent.com/yashikota/yashikota.com/main/contents/about.md";
  const res = await fetch(url);
  const text = await res.text();
  const content = markdownToHtml(text);

  return content;
};

const About = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      const content = await getData();
      setData(content);
    }
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>About :: Garakuta Okiba</title>
      </Head>

      <div className="znc" dangerouslySetInnerHTML={{ __html: data }} />
    </>
  );
};

export default About;
