'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface UnsavedChangesContextValue {
  /** Whether the current page has unsaved changes */
  isDirty: boolean;
  /** Register dirty state from a page — also provide the page's save function */
  setDirty: (dirty: boolean) => void;
  /** Register the current page's save handler */
  registerSaveHandler: (handler: (() => Promise<void>) | null) => void;
  /** Called by the Sidebar before navigating — returns true if navigation should proceed */
  requestNavigation: (targetHref: string) => Promise<boolean>;
  /** Internal: modal state */
  modalState: ModalState | null;
  confirmModal: (action: 'discard' | 'save' | 'keep') => void;
}

interface ModalState {
  targetHref: string;
  resolveRef: (value: boolean) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const saveHandlerRef = useRef<(() => Promise<void>) | null>(null);

  const setDirty = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);

  const registerSaveHandler = useCallback((handler: (() => Promise<void>) | null) => {
    saveHandlerRef.current = handler;
  }, []);

  /**
   * Called by Sidebar links before navigating.
   * If dirty → show modal and wait for user choice.
   * Returns true  → proceed with navigation
   * Returns false → stay on page
   */
  const requestNavigation = useCallback(
    (targetHref: string): Promise<boolean> => {
      if (!isDirty) return Promise.resolve(true);

      return new Promise<boolean>((resolve) => {
        setModalState({ targetHref, resolveRef: resolve });
      });
    },
    [isDirty]
  );

  const confirmModal = useCallback(
    async (action: 'discard' | 'save' | 'keep') => {
      if (!modalState) return;
      const { resolveRef } = modalState;

      if (action === 'keep') {
        setModalState(null);
        resolveRef(false);
        return;
      }

      if (action === 'save') {
        try {
          if (saveHandlerRef.current) {
            await saveHandlerRef.current();
          }
        } catch {
          // Even if save fails, allow navigation (the page's own error handling takes over)
        }
        setIsDirty(false);
        setModalState(null);
        resolveRef(true);
        return;
      }

      // discard
      setIsDirty(false);
      setModalState(null);
      resolveRef(true);
    },
    [modalState]
  );

  return (
    <UnsavedChangesContext.Provider
      value={{ isDirty, setDirty, registerSaveHandler, requestNavigation, modalState, confirmModal }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChangesContext() {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx) throw new Error('useUnsavedChangesContext must be used inside UnsavedChangesProvider');
  return ctx;
}
