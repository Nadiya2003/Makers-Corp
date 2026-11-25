'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  Ship,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { articles, NewsCategory, Article } from '@/data/news';

const categories: Array<'All' | NewsCategory> = [
  'All',
  'Buying Guides',
  'Vehicle Reviews',
  'Country Guides',
  'Shipment Updates',
  'Company News',
];

export function NewsIndexClient() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | NewsCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter((a) => {
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch =
      !searchTerm.trim() ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = articles.find((a) => a.featured) || articles[0];
  const remaining = filteredArticles.filter((a) => a.id !== featured.id || selectedCategory !== 'All' || searchTerm.trim() !== '');

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Hero Header */}
      <section className="bg-[#111111] text-white py-14 sm:py-16 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ff8a33] mb-2">
              <BookOpen className="w-4 h-4" />
              MAKERS CORP JAPAN MEDIA CENTER
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
              News & Reviews
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              Vehicle reviews, buying guides, shipment updates, and insights from Japan. Everything you
              need to navigate vehicle specifications, roadworthiness inspections, and international export logistics.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Search Bar */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-none transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#ff6a00] text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-[#111111]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles & guides..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-none pl-9 pr-3 py-1.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#ff6a00] focus:bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Articles Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* If no search/category filter active, show Editorial Featured Block */}
        {selectedCategory === 'All' && !searchTerm.trim() && (
          <div className="mb-12">
            <div className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
              <span>Featured Editorial</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-neutral-200 rounded-none p-5 sm:p-6 shadow-sm">
              {/* Featured Cover Image */}
              <div className="lg:col-span-7">
                <Link
                  href={`/news/${featured.slug}`}
                  className="group relative block aspect-[16/10] w-full overflow-hidden rounded-none bg-neutral-100"
                >
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="bg-[#ff6a00] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none shadow-sm">
                      {featured.category}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Featured Details */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featured.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTimeMinutes} min read
                    </span>
                  </div>

                  <Link href={`/news/${featured.slug}`} className="group">
                    <h2 className="text-xl sm:text-2xl font-black text-[#111111] group-hover:text-[#ff6a00] transition-colors leading-tight mb-3">
                      {featured.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>

                  {/* Highlights Bullet List */}
                  {featured.keyTakeaways && (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-none p-3.5 mb-4">
                      <div className="text-[11px] font-bold text-neutral-800 uppercase mb-2">
                        Key Takeaways:
                      </div>
                      <ul className="space-y-1.5 text-xs text-neutral-600">
                        {featured.keyTakeaways.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#ff6a00] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    By <strong className="text-neutral-800">{featured.author.name}</strong>
                  </span>
                  <Link
                    href={`/news/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold px-4 py-2 rounded-none transition-colors"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Heading for Remaining Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-[#111111] tracking-tight">
            {selectedCategory === 'All' ? 'Latest Publications & Articles' : `${selectedCategory} (${remaining.length})`}
          </h2>
          <span className="text-xs text-neutral-500">
            {remaining.length} {remaining.length === 1 ? 'article' : 'articles'} found
          </span>
        </div>

        {/* Articles Grid */}
        {remaining.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-none p-12 text-center">
            <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#111111] mb-1">No Articles Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              We couldn’t find any articles matching your search query. Try another keyword or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-[#ff6a00] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remaining.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group flex flex-col bg-white border border-neutral-200 hover:border-[#ff6a00] rounded-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-[#111111]/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-none shadow-sm">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTimeMinutes} min
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#111111] group-hover:text-[#ff6a00] transition-colors leading-snug mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-400">
                      By {article.author.name}
                    </span>
                    <span className="font-bold text-[#ff6a00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Sourcing & Consultation Banner */}
        <div className="mt-14 bg-[#111111] text-white rounded-none p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold text-[#ff8a33] uppercase tracking-widest block mb-1">
              Have specific questions about import rules?
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
              Speak with our Japanese Export Operations Desk
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              We provide tailored homologation checks, JEVIC/JAAI pre-export verification, and CIF shipping estimates directly from Tokyo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/request-a-vehicle"
              className="bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold px-5 py-3 rounded-none transition-colors shadow-sm"
            >
              Request a Vehicle
            </Link>
            <Link
              href="/contact"
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-5 py-3 rounded-none border border-neutral-700 transition-colors"
            >
              Contact Export Desk
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
