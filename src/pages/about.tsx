import Head from "next/head";
import { useEffect, useState } from "react";
import markdownToHtml from "zenn-markdown-html";

const getData = async () => {
  const url =
    "https://gist.githubusercontent.com/yashikota/97e30e6e0546a6cd27abd7cec27c74e1/raw/ca62afe7628af6ad5288af7eb51dc18a116decd0/test.md";
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
        <title>About | Garakuta Okiba</title>
      </Head>

      <div className="znc" dangerouslySetInnerHTML={{ __html: data }} />
    </>
  );
};

export default About;
