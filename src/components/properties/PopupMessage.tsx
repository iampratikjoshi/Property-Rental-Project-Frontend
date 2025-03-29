import React from 'react';

interface PopupMessageProps {
  message: string;
  isSuccess: boolean;
  onClose: () => void;
}

const PopupMessage: React.FC<PopupMessageProps> = ({ message, isSuccess, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg max-w-sm ${isSuccess ? "border-green-500" : "border-red-500"} border-2`}>
        <p className={`text-lg font-semibold mb-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupMessage;