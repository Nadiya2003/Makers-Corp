'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Save, Trash2, X, PenLine } from 'lucide-react';
import { useUnsavedChangesContext } from '@/context/UnsavedChangesContext';

export function UnsavedChangesModal() {
  const { modalState, confirmModal } = useUnsavedChangesContext();
  const keepBtnRef = useRef<HTMLButtonElement>(null);

  // Focus the "Keep Editing" button when modal opens (safest default)
  useEffect(() => {
    if (modalState) {
      setTimeout(() => keepBtnRef.current?.focus(), 50);
    }
  }, [modalState]);

  // Close on Escape key → treat as "Keep Editing"
  useEffect(() => {
    if (!modalState) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') confirmModal('keep');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalState, confirmModal]);

  if (!modalState) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm"
        onClick={() => confirmModal('keep')}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ucm-title"
        className="fixed inset-0 z-[510] flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                <AlertTriangle className="text-amber-500" size={22} strokeWidth={2.5} />
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  id="ucm-title"
                  className="text-xl font-black text-gray-900 tracking-tight mb-1"
                >
                  Unsaved Changes
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  You have unsaved changes on this page. What would you like to do before leaving?
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => confirmModal('keep')}
                className="shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Keep editing"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-8 border-t border-gray-100" />

          {/* Actions */}
          <div className="px-8 py-6 space-y-3">
            {/* Save & Leave */}
            <button
              onClick={() => confirmModal('save')}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all duration-200 hover:shadow-lg hover:shadow-orange-600/20 hover:-translate-y-0.5 active:translate-y-0 group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Save size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-black uppercase tracking-wide">Save & Continue</div>
                <div className="text-xs text-orange-200 font-medium">Save changes, then go to the new section</div>
              </div>
            </button>

            {/* Discard & Leave */}
            <button
              onClick={() => confirmModal('discard')}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-700 font-bold transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-xl bg-gray-200 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                <Trash2 size={16} className="group-hover:text-red-600 transition-colors" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black uppercase tracking-wide">Discard Changes</div>
                <div className="text-xs text-gray-400 group-hover:text-red-400 font-medium transition-colors">
                  Lose your edits and navigate away
                </div>
              </div>
            </button>

            {/* Keep Editing */}
            <button
              ref={keepBtnRef}
              onClick={() => confirmModal('keep')}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-bold transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            >
              <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                <PenLine size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-black uppercase tracking-wide">Keep Editing</div>
                <div className="text-xs text-gray-400 font-medium">Stay on this page and continue working</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
