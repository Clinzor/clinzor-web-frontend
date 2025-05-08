"use client";

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import DropdownPortal from './glassdropdown';
import BottomSheet from './BottomSheet';
import useMedia from '@/src/hooks/useMedia';

interface ResponsiveDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  title?: string;
  placement?: 'bottom-start' | 'bottom-end' | 'bottom';
  maxHeight?: string;
  width?: string;
  className?: string;
  mobileFullWidth?: boolean;
  mobileViewBreakpoint?: string;
}

const ResponsiveDropdown: React.FC<ResponsiveDropdownProps> = ({
  isOpen,
  onClose,
  trigger,
  children,
  title,
  placement = 'bottom-start',
  maxHeight = '20rem',
  width = 'auto',
  className = '',
  mobileFullWidth = true,
  mobileViewBreakpoint = '(max-width: 768px)'
}) => {
  const isMobileView = useMedia(mobileViewBreakpoint);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`dropdown-${Math.random().toString(36).substring(2, 9)}`).current;

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR safety
  if (!mounted) {
    return <div>{trigger}</div>;
  }

  // On mobile, use a bottom sheet
  if (isMobileView) {
    return (
      <>
        <div className="inline-block">{trigger}</div>
        <BottomSheet
          isOpen={isOpen}
          onClose={onClose}
          title={title}
          className={className}
        >
          <div className="py-2">
            {children}
          </div>
        </BottomSheet>
      </>
    );
  }

  // On desktop, use a dropdown rendered via portal
  return (
    <>
      <div ref={triggerRef} id={uniqueId} className="inline-block">
        {trigger}
      </div>
      {isOpen && (
        <DropdownPortal>
          <div
            className={`dropdown-content bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] ${className}`}
            data-parent-id={uniqueId}
            style={{ maxHeight: maxHeight, width: width, overflowY: 'auto' }}
          >
            {children}
          </div>
        </DropdownPortal>
      )}
    </>
  );
};

export default ResponsiveDropdown;
