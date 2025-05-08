"use client";
import { useState, useCallback, useRef } from 'react';

export interface UseDropdownResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  dropdownId: string;
}

/**
 * Hook to manage dropdown state
 * @param initialState - Initial open state
 * @param id - Optional unique identifier for the dropdown
 * @returns Object containing dropdown state and handlers
 */
export default function useDropdown(initialState = false, id?: string): UseDropdownResult {
  const [isOpen, setIsOpen] = useState(initialState);
  const triggerRef = useRef<HTMLElement>(null);
  
  // Generate a unique ID if none provided
  const dropdownId = id || `dropdown-${Math.random().toString(36).substring(2, 11)}`;
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
    dropdownId
  };
}