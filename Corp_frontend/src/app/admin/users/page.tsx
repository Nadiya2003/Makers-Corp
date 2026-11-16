'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Mail, 
  Shield, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  X,
  UserPlus
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/auth`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelete = async (id: string) => {
    const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{}');
    if (adminUser._id === id) {
      showStatus('error', "You cannot delete your own account.");
      return;
    }

    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/auth/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((u: any) => u._id !== id));
        showStatus('success', 'User removed successfully.');
      }
    } catch (err) {
      showStatus('error', 'Failed to remove user.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showStatus('success', 'New admin user registered successfully.');
        setShowModal(false);
        setFormData({ name: '', email: '', password: '' });
        fetchUsers();
      } else {
        showStatus('error', data.message || 'Registration failed.');
      }
    } catch (err) {
      showStatus('error', 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-black uppercase tracking-tighter">User Management</h1>
          <p className="text-gray-500 font-medium text-sm">Manage administrative access and team members.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl"
        >
          <Plus size={16} /> Add New Admin
        </button>
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

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading Team...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-600/10 text-orange-600 rounded-2xl flex items-center justify-center font-black text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-900 font-black text-sm uppercase tracking-tight">{user.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                             <Mail size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 px-3 py-1 bg-black text-white text-[9px] font-black rounded-lg uppercase tracking-widest w-fit">
                          <Shield size={10} className="text-orange-500" /> Super Admin
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-gray-400 text-xs font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                         onClick={() => handleDelete(user._id)}
                         className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 relative z-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white">
                    <UserPlus size={24} />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">New Admin</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" required 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" required 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Access Password</label>
                  <input 
                    type="password" required 
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                  />
               </div>

               <button 
                 type="submit" disabled={submitting}
                 className="w-full bg-black hover:bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl mt-4"
               >
                 {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Register Administrator'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
