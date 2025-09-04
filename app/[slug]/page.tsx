import { notFound } from 'next/navigation';
import { getAllChallenges, getChallengeBySlug } from '@/lib/content';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export async function generateStaticParams() {
  const items = await getAllChallenges();
  return items.map((i) => ({ slug: i.slug }));
}

export default async function ChallengePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getChallengeBySlug(params.slug);
  if (!post) return notFound();

  return (
    <article className="prose dark:prose-invert max-w-3xl mx-auto p-6">
      <h1>{post.meta.title}</h1>
      <p className="text-sm opacity-70 mb-6">
        {post.meta.platform} • {post.meta.date}
      </p>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {post.content}
      </ReactMarkdown>
    </article>
  );
}

