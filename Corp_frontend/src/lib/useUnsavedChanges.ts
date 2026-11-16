import { useEffect, useRef } from 'react';
import { useUnsavedChangesContext } from '@/context/UnsavedChangesContext';

/**
 * Use this hook in any admin page that has a form.
 *
 * @param isDirty  - true when the user has made unsaved changes
 * @param onSave   - async function that saves the current form (same as the page's save button handler)
 *
 * Example:
 *   useUnsavedChanges(isDirty, handleSave);
 */
export function useUnsavedChanges(
  isDirty: boolean,
  onSave: () => Promise<void>
) {
  const { setDirty, registerSaveHandler } = useUnsavedChangesContext();

  // Always hold the latest save handler without needing to re-register
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  });

  // Register a stable wrapper once — it always calls the latest onSave via the ref
  useEffect(() => {
    const stableHandler = () => onSaveRef.current();
    registerSaveHandler(stableHandler);
    return () => {
      // Cleanup: unregister and clear dirty when page unmounts
      registerSaveHandler(null);
      setDirty(false);
    };
  }, [registerSaveHandler, setDirty]); // ← run once on mount / unmount

  // Keep context in sync with local dirty state
  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);
}
