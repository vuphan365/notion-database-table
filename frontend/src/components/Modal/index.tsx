import React from 'react';

interface ModalProps extends React.PropsWithChildren {
  title: React.ReactNode;
  onClose: () => void;
}
const Modal = ({ title, children, onClose }: ModalProps) => (
  <div
    id="static-modal"
    data-modal-backdrop="static"
    aria-hidden="true"
    className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
  >
    <div className="w-full h-full absolute bg-slate-400 opacity-50"></div>
    <div className="relative p-4 w-fit max-h-full">
      <div className="relative bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            data-modal-hide="static-modal"
            onClick={onClose}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-4 md:p-5 space-y-4">{children}</div>
      </div>
    </div>
  </div>
);

export default Modal;
