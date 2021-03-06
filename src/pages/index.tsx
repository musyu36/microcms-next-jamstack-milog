import { client } from 'libs/client';
import Link from 'next/link';

import type { InferGetStaticPropsType, NextPage } from "next";
import type { Blog } from "types/blog";

export const getStaticProps = async () => {
  const blog = await client.get({ endpoint: "blog" });

  return {
    props: {
      blogs: blog.contents,
    },
  };
};

type Props = {
  blogs: Blog[];
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  blogs,
}: Props) => {
  return (
    <div>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>
              <a>{blog.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
