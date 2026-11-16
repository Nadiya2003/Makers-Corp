'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowRight,
  BookOpen,
  Ship,
  ShieldCheck,
  User
} from 'lucide-react';
import { Article, getRelatedArticles } from '@/data/news';

export function ArticleDetailClient({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false);
  const related = getRelatedArticles(article.slug, 3);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="bg-[#F8FAFC] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to News & Reviews</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-orange-600 px-3 py-1.5 rounded-md shadow-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Guide</span>
              </>
            )}
          </button>
        </div>

        {/* Article Header Card */}
        <header className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-sm">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">Makers Corp Japan Editorial</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-medium">
              {article.subtitle}
            </p>
          )}

          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{article.author.name}</div>
                <div className="text-[11px] text-slate-500">{article.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {article.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTimeMinutes} min read
              </span>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 bg-slate-100 border border-slate-200 shadow-sm">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
            className="object-cover"
          />
        </div>

        {/* Key Takeaways Plaque */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <aside className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-5 sm:p-6 mb-8">
            <h2 className="text-xs font-black uppercase tracking-wider text-orange-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              Essential Key Takeaways
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800">
              {article.keyTakeaways.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Article Body Content */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          {article.content.map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="text-lg sm:text-xl font-black text-slate-900 tracking-tight pt-4 border-t border-slate-100"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }

            if (paragraph.includes('\n- ')) {
              const [intro, ...bullets] = paragraph.split('\n- ');
              return (
                <div key={idx} className="space-y-2">
                  {intro && <p>{intro}</p>}
                  <ul className="space-y-1.5 pl-4">
                    {bullets.map((b, bi) => {
                      // Parse bold formatting **text**
                      const parts = b.split('**');
                      return (
                        <li key={bi} className="list-disc text-sm text-slate-700 leading-relaxed">
                          {parts.map((p, pi) =>
                            pi % 2 === 1 ? <strong key={pi} className="text-slate-900">{p}</strong> : p
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }

            return (
              <p key={idx} className="text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Contextual Action Banner */}
        <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block mb-1">
              Looking for a verified vehicle from Japan?
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight mb-1">
              Browse Genuine Japan Yard Stock or Request Sourcing
            </h3>
            <p className="text-xs text-slate-300">
              All vehicles include genuine chassis codes, verified mileage, and pre-export inspection reports.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/vehicles"
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Browse Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/request-a-vehicle"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-700 transition-colors"
            >
              Request Sourcing
            </Link>
          </div>
        </div>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">
              Related Articles & Sourcing Guides
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/news/${rel.slug}`}
                  className="group bg-white border border-slate-200 hover:border-orange-500 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={rel.coverImage}
                      alt={rel.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-slate-900/90 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                        {rel.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-grow">
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                      Read article <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
