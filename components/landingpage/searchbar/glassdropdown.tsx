"use client";

import React, {
  useRef,
  useEffect,
  useState,
  ReactElement,
} from "react";
import { createPortal } from "react-dom";

interface DropdownPortalProps {
  children: ReactElement<any>;
}

const DropdownPortal: React.FC<DropdownPortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const childRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);

    if (!portalRef.current) {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.top = "0";
      div.style.left = "0";
      div.style.zIndex = "9999";
      div.style.width = "100%";
      div.style.pointerEvents = "none";
      document.body.appendChild(div);
      portalRef.current = div;
    }

    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
        portalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!childRef.current || !portalRef.current) return;

    const updatePosition = () => {
      const dropdowns = portalRef.current!.querySelectorAll(".dropdown-content");
      dropdowns.forEach((dropdown) => {
        const parentId = dropdown.getAttribute("data-parent-id");
        const parentEl = document.getElementById(parentId || "");
        if (parentEl) {
          const rect = parentEl.getBoundingClientRect();
          const el = dropdown as HTMLElement;
          el.style.position = "fixed";
          el.style.top = `${rect.bottom}px`;
          el.style.left = `${rect.left}px`;
          el.style.width = `${rect.width}px`;
          el.style.pointerEvents = "auto";
        }
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [mounted]);

  if (!mounted || !portalRef.current) {
    return <div ref={childRef}>{children}</div>;
  }

  const uniqueId = `dropdown-${Math.random().toString(36).substring(2, 9)}`;
  const originalProps = children.props as Record<string, any>;
  const existingClass = originalProps.className || "";

  const childrenWithProps = React.cloneElement(children, {
    ...originalProps,
    className: `${existingClass} dropdown-content`,
    ["data-parent-id"]: uniqueId,
  });

  return (
    <>
      <div id={uniqueId} ref={childRef} />
      {createPortal(childrenWithProps, portalRef.current)}
    </>
  );
};

export default DropdownPortal;
