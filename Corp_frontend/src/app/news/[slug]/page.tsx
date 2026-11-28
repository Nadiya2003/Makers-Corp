import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, getArticleBySlug } from '@/data/news';
import { fetchLiveArticle, fetchLiveArticles } from '@/lib/api';
import { ArticleDetailClient } from './ArticleDetailClient';

interface Props {
  params: {
    slug: string;
  };
}

// Allow any dynamic slug uploaded via Admin Dashboard to render without 404
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const live = await fetchLiveArticles().catch(() => []);
    const liveSlugs = (live || []).filter((a) => a.slug).map((a) => ({ slug: a.slug }));
    const staticSlugs = articles.map((article) => ({ slug: article.slug }));
    // Merge unique slugs
    const seen = new Set<string>();
    const all = [...liveSlugs, ...staticSlugs].filter((item) => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
    return all;
  } catch {
    return articles.map((article) => ({ slug: article.slug }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = (await fetchLiveArticle(params.slug)) || getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: `${article.title} — Makers Corp Japan Media Center`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} — Makers Corp Japan`,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = (await fetchLiveArticle(params.slug)) || getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailClient article={article} />;
}
