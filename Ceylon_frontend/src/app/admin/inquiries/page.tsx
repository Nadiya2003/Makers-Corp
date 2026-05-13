'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  Loader2, 
  Clock,
  Phone,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  User,
  MessageSquare,
  Car
} from 'lucide-react';

export default function InquiriesManagement() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    if (selectedInquiry) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedInquiry]);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/inquiries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(inquiries.filter((inq: any) => inq._id !== id));
        showStatus('success', 'Inquiry deleted successfully.');
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
      }
    } catch (err) {
      showStatus('error', 'Failed to delete inquiry.');
    }
  };

  const filteredInquiries = inquiries.filter((inq: any) => 
    inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.vehicle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-black uppercase tracking-tighter">Customer Inquiries</h1>
          <p className="text-gray-500 font-medium text-sm">Review and manage interest from potential buyers.</p>
        </div>
        <div className="bg-orange-600/10 text-orange-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-orange-600/20">
          {inquiries.length} Total Inquiries
        </div>
      </div>

      {/* Status Messages */}
      {statusMessage && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all animate-in slide-in-from-right ${
          statusMessage.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={24} className="text-orange-500" /> : <AlertCircle size={24} />}
          <span className="font-bold">{statusMessage.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-5 rounded-3xl flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600 transition-all font-bold"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Accessing Database...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preview Message</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inq: any) => (
                    <tr 
                      key={inq._id} 
                      onClick={() => setSelectedInquiry(inq)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg group-hover:bg-orange-600 transition-colors">
                            {inq.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <p className="text-gray-900 font-black text-sm uppercase tracking-tight">{inq.name}</p>
                             <p className="text-[10px] text-gray-400 font-bold">{inq.email || 'No Email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1.5 bg-orange-600/5 text-orange-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-orange-600/10">
                          {inq.vehicle}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-gray-500 text-xs max-w-xs truncate font-medium">
                          {inq.message}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                          <Clock size={14} className="text-gray-300" />
                          {new Date(inq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             className="p-2.5 text-gray-400 hover:text-black hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"
                             title="View Details"
                           >
                             <Eye size={18} />
                           </button>
                           <button 
                             onClick={(e) => handleDelete(e, inq._id)}
                             className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                             title="Delete"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                       <Mail size={48} className="mx-auto text-gray-200 mb-4" />
                       <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No inquiries found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl" onClick={() => setSelectedInquiry(null)} />
          <div className="bg-white w-full max-w-2xl rounded-[3rem] relative z-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-12 pb-6 bg-white z-20">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-orange-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-orange-600/20">
                    <Mail size={28} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-tight">Inquiry Detail</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Received on {new Date(selectedInquiry.createdAt).toLocaleDateString()}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors group">
                <X size={28} className="text-gray-400 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-12 pt-4 custom-scrollbar">
              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-2">
                          <User size={12} /> Full Name
                      </label>
                      <p className="text-lg font-black text-gray-900 uppercase">{selectedInquiry.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-2">
                          <Car size={12} /> Interested Vehicle
                      </label>
                      <div className="inline-block px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                          {selectedInquiry.vehicle}
                      </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2 text-wrap break-words">
                      <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-2">
                          <Mail size={12} /> Email Address
                      </label>
                      <p className="text-sm font-bold text-gray-600">{selectedInquiry.email || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-2">
                          <Phone size={12} /> Phone Number
                      </label>
                      <p className="text-sm font-bold text-gray-600">{selectedInquiry.phone}</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                      <MessageSquare size={14} /> Message Content
                    </label>
                    <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 italic text-gray-700 leading-relaxed font-medium">
                      "{selectedInquiry.message}"
                    </div>
                </div>

                <div className="pt-10 flex justify-end">
                    <button 
                      onClick={() => setSelectedInquiry(null)}
                      className="bg-black hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl"
                    >
                      Mark as Read & Close
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
