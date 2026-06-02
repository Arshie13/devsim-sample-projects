import { useEffect, type ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div role="dialog" aria-modal="true" className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {title ? <h2 className="text-lg font-semibold mb-3">{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}
