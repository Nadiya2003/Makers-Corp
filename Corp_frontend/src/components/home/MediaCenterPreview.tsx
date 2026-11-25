'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Clock, Calendar, ChevronRight } from 'lucide-react';
import { articles, getFeaturedArticle } from '@/data/news';

export function MediaCenterPreview() {
  const featured = getFeaturedArticle();
  const secondaryArticles = articles.filter((a) => a.id !== featured.id).slice(0, 2);

  return (
    <section className="bg-white py-12 border-b border-neutral-200 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#ff6a00] mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              MAKERS CORP JAPAN MEDIA CENTER
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              News & Reviews
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-medium">
              Vehicle reviews, buying guides, shipment updates, and insights from Japan.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-[#ff6a00] bg-white hover:bg-[#fff4eb] border border-neutral-300 hover:border-[#ff6a00] px-4 py-2.5 rounded-none shadow-sm transition-all shrink-0"
          >
            <span>View All Articles & Guides</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#ff6a00]" />
          </Link>
        </div>

        {/* Editorial Layout (Square Corners) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Prominent Featured Article */}
          <div className="lg:col-span-7">
            <Link
              href={`/news/${featured.slug}`}
              className="group flex flex-col h-full bg-white border border-neutral-300 hover:border-[#ff6a00] rounded-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-150"
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-100 rounded-none">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#ff6a00] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none shadow-sm">
                    {featured.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {featured.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTimeMinutes} min read
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-neutral-900 group-hover:text-[#ff6a00] transition-colors leading-snug mb-2">
                    {featured.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3 mb-4">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">
                    By <strong className="text-neutral-900">{featured.author.name}</strong> ({featured.author.role})
                  </span>
                  <span className="font-bold text-[#ff6a00] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary Articles Column */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {secondaryArticles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group flex flex-col sm:flex-row flex-1 bg-white border border-neutral-300 hover:border-[#ff6a00] rounded-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-150"
              >
                <div className="relative sm:w-44 h-36 sm:h-auto overflow-hidden bg-neutral-100 shrink-0 rounded-none">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 180px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-neutral-900/95 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mb-1 font-medium">
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span>{article.readTimeMinutes} min</span>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 group-hover:text-[#ff6a00] transition-colors line-clamp-2 leading-snug mb-1.5">
                      {article.title}
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#ff6a00]">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
