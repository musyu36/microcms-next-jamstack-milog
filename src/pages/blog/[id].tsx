import 'highlight.js/styles/hybrid.css';

import cheerio from 'cheerio';
import hljs from 'highlight.js';
import { client } from 'libs/client';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { Params } from 'next/dist/server/router';

import type { Blog } from "types/blog";

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const data = await client.get({ endpoint: "blog" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Params> = async (context) => {
  const id: string = context.params?.id as string;
  const blog = await client.get({ endpoint: "blog", contentId: id });

  const $ = cheerio.load(blog.body);
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  return {
    props: {
      blog,
      highlightedBody: $.html(),
    },
  };
};

type Props = {
  blog: Blog;
  highlightedBody: string;
};

const BlogId: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  blog,
  highlightedBody,
}: Props) => {
  return (
    <main>
      <h1>{blog.title}</h1>
      <p>{blog.publishedAt}</p>

      {/* APIのレスポンスはHTMLタグも文字列として取得される文字列形式なのでHTMLとして描画するためにdangerouslySetInnerHTMLを使用 */}
      <div
        dangerouslySetInnerHTML={{
          __html: `${highlightedBody}`,
        }}
      />
    </main>
  );
};

export default BlogId;
