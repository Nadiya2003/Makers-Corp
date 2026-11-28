'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Newspaper,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const CATEGORIES = [
  'BUYING GUIDES',
  'MARKET UPDATES',
  'SHIPPING & LOGISTICS',
  'VEHICLE REVIEWS',
  'AUCTION GUIDES',
  'EXPORT PROCESS'
];

export default function NewsManagement() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'BUYING GUIDES',
    readTime: '5 min',
    excerpt: '',
    content: '',
    coverImage: '',
    authorName: 'Kenji Takahashi',
    authorRole: 'Export Operations Desk, Tokyo',
    isFeatured: false,
    isPublished: true
  });

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/articles`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleOpenModal = (article: any = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        category: article.category || 'BUYING GUIDES',
        readTime: article.readTime || '5 min',
        excerpt: article.excerpt || '',
        content: Array.isArray(article.content) ? article.content.join('\n\n') : (article.content || ''),
        coverImage: article.coverImage || '',
        authorName: article.author?.name || 'Kenji Takahashi',
        authorRole: article.author?.role || 'Export Operations Desk, Tokyo',
        isFeatured: Boolean(article.isFeatured),
        isPublished: article.isPublished !== false
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        slug: '',
        category: 'BUYING GUIDES',
        readTime: '5 min',
        excerpt: '',
        content: '',
        coverImage: '',
        authorName: 'Kenji Takahashi',
        authorRole: 'Export Operations Desk, Tokyo',
        isFeatured: false,
        isPublished: true
      });
    }
    setShowModal(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editingArticle ? prev.slug : generatedSlug
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append('photos', e.target.files[0]);
    uploadData.append('category', 'News');

    try {
      const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setFormData(prev => ({ ...prev, coverImage: data.data[0].url }));
        showNotification('success', 'Cover image uploaded successfully');
      } else {
        showNotification('error', data.message || 'Image upload failed');
      }
    } catch (err) {
      showNotification('error', 'Network error during image upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
      const payload = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        readTime: formData.readTime,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        author: {
          name: formData.authorName,
          role: formData.authorRole
        },
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished
      };

      const url = editingArticle ? `${apiUrl}/articles/${editingArticle._id}` : `${apiUrl}/articles`;
      const method = editingArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', editingArticle ? 'Article updated successfully!' : 'Article created successfully!');
        setShowModal(false);
        fetchArticles();
      } else {
        showNotification('error', data.message || 'Action failed');
      }
    } catch (err) {
      showNotification('error', 'Network error saving article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Article deleted successfully');
        setConfirmDeleteId(null);
        fetchArticles();
      } else {
        showNotification('error', data.message || 'Delete failed');
      }
    } catch (err) {
      showNotification('error', 'Network error deleting article');
    }
  };

  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all shadow-md ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              Content & Editorial CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            News, Reviews & Export Guides
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Manage public buying guides, auction standards, market intelligence, and logistical walkthroughs.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20 transition-all"
        >
          <Plus size={16} />
          <span>Publish New Article</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, keyword, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Categories ({articles.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Loading Articles...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <Newspaper size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-700 uppercase tracking-wider">No Articles Found</h3>
          <p className="text-gray-400 text-xs mt-1">Try modifying your search or publish your first export guide.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div 
              key={article._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <Newspaper size={36} />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-lg">
                    {article.category}
                  </span>
                  {article.isFeatured && (
                    <span className="px-2.5 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-md">
                      <Sparkles size={10} /> Featured
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                    article.isPublished !== false 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-zinc-700 text-zinc-200'
                  }`}>
                    {article.isPublished !== false ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold">
                    <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime || '5 min'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-black text-gray-900 text-base leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-600 truncate max-w-[130px]">
                    By {article.author?.name || 'Kenji Takahashi'}
                  </span>

                  <div className="flex items-center gap-1">
                    <a
                      href={`/news/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                      title="View on site"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button
                      onClick={() => handleOpenModal(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit article"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(article._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete article"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  {editingArticle ? 'Edit Article' : 'Publish New Article'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Full control over titles, slugs, categories, cover imagery, and body content.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. How Buying a Vehicle From Japan Works"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. how-buying-a-vehicle-from-japan-works"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Category, Read Time, Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                    placeholder="e.g. 6 min"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                    placeholder="e.g. Kenji Takahashi"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="https://... or /images/..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>Upload</span>
                  </button>
                </div>
                {formData.coverImage && (
                  <div className="mt-3 relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Summary Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary to show on cards and social shares..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Full Article Content (Markdown or Structured Text) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter article text, headers (### Stage 1), bullet lists (- item)..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Featured & Published Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Feature on Homepage News Banner
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Published & Live
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingArticle ? 'Save Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight mb-2">Delete Article?</h3>
            <p className="text-xs text-gray-500 mb-6">
              This action will remove the article from the public website immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 uppercase tracking-wider shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
