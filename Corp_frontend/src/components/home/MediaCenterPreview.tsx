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
    <section className="bg-slate-50 py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-orange-600 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              MAKERS CORP JAPAN MEDIA CENTER
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              News & Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Vehicle reviews, buying guides, shipment updates, and insights from Japan.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-orange-600 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 px-4 py-2.5 rounded-lg shadow-sm transition-all shrink-0"
          >
            <span>View All Articles & Guides</span>
            <ChevronRight className="w-3.5 h-3.5 text-orange-600" />
          </Link>
        </div>

        {/* Editorial Layout: 1 Featured Card Beside 2 Secondary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Prominent Featured Article */}
          <div className="lg:col-span-7">
            <Link
              href={`/news/${featured.slug}`}
              className="group flex flex-col h-full bg-white border border-slate-200 hover:border-orange-500 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute top-3.5 left-3.5">
                  <span className="bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                    {featured.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5" />
                    {featured.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTimeMinutes} min read
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug mb-2">
                    {featured.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    By <strong className="text-slate-800">{featured.author.name}</strong> ({featured.author.role})
                  </span>
                  <span className="font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
                className="group flex flex-col sm:flex-row flex-1 bg-white border border-slate-200 hover:border-orange-500 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative sm:w-44 h-36 sm:h-auto overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 180px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span>{article.readTimeMinutes} min</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-1.5">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
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
