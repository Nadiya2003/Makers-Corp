'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Upload,
  X,
  Globe,
  Building,
  UserCheck
} from 'lucide-react';

interface ReviewItem {
  _id?: string;
  id?: string;
  customerName: string;
  country: string;
  companyName?: string;
  designation?: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
  avatar?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt?: string;
}

const POPULAR_COUNTRIES = [
  'India',
  'Sri Lanka',
  'Kenya',
  'United Kingdom',
  'United Arab Emirates',
  'Tanzania',
  'Uganda',
  'Pakistan',
  'Cyprus',
  'New Zealand',
  'Australia',
  'Guyana',
  'Jamaica',
  'Other'
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    customerName: '',
    country: 'India',
    companyName: '',
    designation: '',
    rating: 5,
    reviewText: '',
    reviewDate: new Date().toISOString().split('T')[0],
    avatar: '',
    isPublished: true,
    isFeatured: false
  });

  // Action status message
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const res = await fetch(`${apiUrl}/reviews/admin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({
      customerName: '',
      country: 'India',
      companyName: '',
      designation: '',
      rating: 5,
      reviewText: '',
      reviewDate: new Date().toISOString().split('T')[0],
      avatar: '',
      isPublished: true,
      isFeatured: false
    });
    setShowModal(true);
  };

  const openEditModal = (r: ReviewItem) => {
    setEditingReview(r);
    setFormData({
      customerName: r.customerName,
      country: r.country,
      companyName: r.companyName || '',
      designation: r.designation || '',
      rating: r.rating || 5,
      reviewText: r.reviewText,
      reviewDate: r.reviewDate ? new Date(r.reviewDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      avatar: r.avatar || '',
      isPublished: Boolean(r.isPublished),
      isFeatured: Boolean(r.isFeatured)
    });
    setShowModal(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const fd = new FormData();
      fd.append('photos', e.target.files[0]);
      fd.append('category', 'Reviews');

      const res = await fetch(`${apiUrl}/media`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setFormData((prev) => ({ ...prev, avatar: data.data[0].url }));
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Avatar upload failed.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.country.trim() || !formData.reviewText.trim()) {
      setActionMessage({ type: 'error', text: 'Customer name, country, and review testimonial are required.' });
      return;
    }

    setModalSubmitting(true);
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const endpoint = editingReview
        ? `${apiUrl}/reviews/${editingReview._id || editingReview.id}`
        : `${apiUrl}/reviews`;
      const method = editingReview ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        setActionMessage({
          type: 'success',
          text: editingReview ? 'Customer review updated successfully!' : 'Customer review published successfully!'
        });
        fetchReviews();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Operation failed.' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Network communication error.' });
    } finally {
      setModalSubmitting(false);
      setTimeout(() => setActionMessage(null), 3500);
    }
  };

  const handleTogglePublish = async (r: ReviewItem) => {
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const id = r._id || r.id;

    try {
      const res = await fetch(`${apiUrl}/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isPublished: !r.isPublished })
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((item) => ((item._id || item.id) === id ? { ...item, isPublished: !r.isPublished } : item))
        );
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Failed to update publication status.' });
    }
  };

  const handleToggleFeature = async (r: ReviewItem) => {
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const id = r._id || r.id;

    try {
      const res = await fetch(`${apiUrl}/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isFeatured: !r.isFeatured })
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((item) => ((item._id || item.id) === id ? { ...item, isFeatured: !r.isFeatured } : item))
        );
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Failed to update featured status.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const res = await fetch(`${apiUrl}/reviews/${deleteId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => (r._id || r.id) !== deleteId));
        setActionMessage({ type: 'success', text: 'Review deleted successfully.' });
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Delete failed.' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Network error deleting review.' });
    } finally {
      setDeleting(false);
      setDeleteId(null);
      setTimeout(() => setActionMessage(null), 3500);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = r.customerName?.toLowerCase().includes(q);
        const matchCountry = r.country?.toLowerCase().includes(q);
        const matchCompany = r.companyName?.toLowerCase().includes(q);
        const matchText = r.reviewText?.toLowerCase().includes(q);
        if (!matchName && !matchCountry && !matchCompany && !matchText) return false;
      }

      if (statusFilter === 'published' && !r.isPublished) return false;
      if (statusFilter === 'draft' && r.isPublished) return false;
      if (statusFilter === 'featured' && !r.isFeatured) return false;

      if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false;

      return true;
    });
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  return (
    <div className="bg-neutral-50 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-sm" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
              MAKERS CORP JAPAN · CLIENT RELATIONS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-none mt-1">
            Customer Reviews & Testimonials
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage genuine verified buyer reviews from India, Sri Lanka, Kenya, UK, and worldwide markets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchReviews}
            className="p-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-lg transition-colors"
            title="Refresh reviews"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{actionMessage.text}</span>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, country, or company..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#ff6a00] focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-[#ff6a00]"
            >
              <option value="all">All Statuses ({reviews.length})</option>
              <option value="published">Published Only</option>
              <option value="featured">Featured On Homepage</option>
              <option value="draft">Drafts / Hidden</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="lg:col-span-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs text-neutral-900 font-medium focus:outline-none focus:border-[#ff6a00]"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
            </select>
          </div>

          {/* Review Stats */}
          <div className="lg:col-span-2 flex items-center justify-end text-xs text-neutral-500 font-mono">
            <span>{filteredReviews.length} records</span>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-16 text-center">
          <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
          <span className="text-xs font-bold text-neutral-600">Loading customer reviews...</span>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center shadow-xs">
          <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-neutral-900">No Reviews Found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            No customer reviews match your selected filter criteria.
          </p>
          <div className="mt-4">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Review</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-3">Country & Market</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-4">Testimonial Summary</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredReviews.map((r) => {
                  const id = r._id || r.id;

                  return (
                    <tr key={id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Client Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-200 overflow-hidden relative shrink-0 border border-neutral-200">
                            {r.avatar ? (
                              <Image
                                src={r.avatar}
                                alt={r.customerName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-neutral-600 text-xs bg-neutral-100">
                                {r.customerName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-black text-neutral-900 block leading-tight">
                              {r.customerName}
                            </span>
                            {r.companyName && (
                              <span className="text-[10px] text-neutral-500 font-medium block">
                                {r.designation ? `${r.designation}, ` : ''}{r.companyName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Country */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-bold text-neutral-800 text-[11px]">
                          <Globe className="w-3 h-3 text-[#ff6a00]" />
                          {r.country}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Review Preview */}
                      <td className="py-3 px-4 max-w-md">
                        <p className="text-neutral-700 text-xs leading-relaxed line-clamp-2">
                          &ldquo;{r.reviewText}&rdquo;
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 font-mono text-neutral-500 text-[11px] whitespace-nowrap">
                        {r.reviewDate ? new Date(r.reviewDate).toISOString().split('T')[0] : '—'}
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(r)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                            r.isFeatured
                              ? 'bg-[#fff4eb] text-[#ff6a00] border border-[#ffd1ad]'
                              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{r.isFeatured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(r)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                            r.isPublished
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          }`}
                        >
                          {r.isPublished ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                          <span>{r.isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(r)}
                            className="p-1.5 text-neutral-600 hover:text-[#ff6a00] hover:bg-[#fff4eb] rounded transition-colors"
                            title="Edit Review"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(id || '')}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Review Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#ff6a00]" />
                <h3 className="text-base font-black text-neutral-900">
                  {editingReview ? 'Edit Customer Review' : 'Add New Customer Review'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    CUSTOMER NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Rajesh Patel, Captain Michael Obiero"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    DESTINATION / COUNTRY *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. India, Sri Lanka, Kenya, UK"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    COMPANY NAME (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Patel Motors Import Ltd"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    DESIGNATION / ROLE (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Managing Director, Fleet Head"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    STAR RATING (1 – 5) *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none focus:border-[#ff6a00]"
                  >
                    <option value={5}>★★★★★ 5 Stars (Excellent)</option>
                    <option value={4}>★★★★☆ 4 Stars (Very Good)</option>
                    <option value={3}>★★★☆☆ 3 Stars (Good)</option>
                  </select>
                </div>

                {/* Review Date */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                    REVIEW DATE
                  </label>
                  <input
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              {/* Review Testimonial Text */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                  CUSTOMER REVIEW TESTIMONIAL *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  placeholder="Detailing physical stock inspection, export document accuracy, port arrival, and customer satisfaction."
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00] leading-relaxed"
                />
              </div>

              {/* Avatar Upload / URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-neutral-700 mb-1">
                  CUSTOMER PHOTOGRAPH / COMPANY LOGO (OPTIONAL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://... or upload photo"
                    className="flex-grow bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg border border-neutral-300 inline-flex items-center gap-1 shrink-0"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Upload</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Toggles: Featured & Published */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#ff6a00] rounded focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Featured Review</span>
                    <span className="text-[10px] text-neutral-400 block">Prioritize on homepage</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Publish Publicly</span>
                    <span className="text-[10px] text-neutral-400 block">Visible on website</span>
                  </div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={modalSubmitting}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-5 py-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  {modalSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{editingReview ? 'Update Review' : 'Save Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-neutral-900 mb-1">Confirm Review Deletion</h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              Are you sure you want to permanently delete this customer testimonial? It will be removed from the public website immediately.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
