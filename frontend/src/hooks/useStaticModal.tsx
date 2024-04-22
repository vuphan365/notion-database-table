import React, { useRef } from 'react';
import { Container, createRoot, Root } from 'react-dom/client';

interface UseStaticModalValues {
  openModal: (modal: React.ReactNode) => void;
  closeModal: () => void;
}
const useStaticModal = (): UseStaticModalValues => {
  const modalRoot = useRef<Root>();

  const closeModal = () => {
    modalRoot.current?.unmount();
  };

  const openModal = (modal: React.ReactNode) => {
    closeModal();
    const div = document.getElementById('modal-static');
    if (!div) return;
    modalRoot.current = createRoot(div);
    modalRoot.current.render(modal);
  };

  return {
    closeModal,
    openModal,
  };
};

export default useStaticModal;
