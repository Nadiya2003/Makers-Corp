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
  UserPlus,
  KeyRound,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // New User Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [submittingUser, setSubmittingUser] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [showPassToggle, setShowPassToggle] = useState(false);

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/auth`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
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

    if (!confirm('Are you sure you want to remove this operator?')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/auth/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((u: any) => u._id !== id));
        showStatus('success', 'User removed successfully.');
      } else {
        showStatus('error', data.message || 'Failed to remove user');
      }
    } catch (err) {
      showStatus('error', 'Failed to remove user.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUser(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showStatus('success', 'New authorized administrator registered.');
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', role: 'admin' });
        fetchUsers();
      } else {
        showStatus('error', data.message || 'Registration failed.');
      }
    } catch (err) {
      showStatus('error', 'Network error occurred.');
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showStatus('error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showStatus('error', 'Password must be at least 6 characters long');
      return;
    }

    setSubmittingPassword(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('success', 'Password updated successfully!');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        showStatus('error', data.message || 'Failed to update password');
      }
    } catch (err) {
      showStatus('error', 'Network error changing password');
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Status Alerts */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold shadow-md ${
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
              Access Control & Credentials
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            User & Security Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Manage authorized operators, update administrator passwords, and review security access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-2xl text-xs uppercase tracking-wider border border-gray-200 shadow-sm transition-all"
          >
            <KeyRound size={16} />
            <span>Change My Password</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20 transition-all"
          >
            <UserPlus size={16} />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      {/* User Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
            Authorized System Operators ({users.length})
          </h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Bcrypt Hashed & JWT Secured
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Loading Operators...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((user: any) => (
              <div key={user._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white font-black text-sm rounded-2xl flex items-center justify-center shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider rounded-md border border-orange-100">
                        {user.role || 'Admin'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <Mail size={12} />
                      <span>{user.email}</span>
                      <span>•</span>
                      <span>Created {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Remove Operator"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <KeyRound size={20} className="text-orange-600" />
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Change Password</h3>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Current Password *
                </label>
                <input
                  type={showPassToggle ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  New Password *
                </label>
                <input
                  type={showPassToggle ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Confirm New Password *
                </label>
                <input
                  type={showPassToggle ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassToggle(!showPassToggle)}
                  className="text-xs text-gray-500 hover:text-gray-800 font-semibold"
                >
                  {showPassToggle ? 'Hide Characters' : 'Show Characters'}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPassword}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-md flex items-center gap-2"
                >
                  {submittingPassword && <Loader2 size={12} className="animate-spin" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Operator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-orange-600" />
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Add Administrator</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Kenji Takahashi"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. tokyo-desk@makers-corp.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-md flex items-center gap-2"
                >
                  {submittingUser && <Loader2 size={12} className="animate-spin" />}
                  <span>Authorize User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
