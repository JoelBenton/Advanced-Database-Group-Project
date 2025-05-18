"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowConfirm(true);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  function handleCloseClick() {
    setShowConfirm(true);
  }

  function confirmClose() {
    setShowConfirm(false);
    onClose();
  }

  // Only return null after hooks are set up
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center overflow-y-auto">
        <div
          ref={modalRef}
          className="p-6 rounded-lg bg-white relative shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleCloseClick}
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
          >
            ×
          </button>
          {children}
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to close?"
          onConfirm={confirmClose}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
