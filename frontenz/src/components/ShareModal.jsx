import { X, Phone, Mail, Download } from "lucide-react";

const ShareModal = ({ card, onClose }) => {
  if (!card) return null;

  const handleDownloadQR = () => {
    alert("Downloading QR Code...");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fadeIn">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-800">Share Card</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm mb-6">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=nexcard.com/u/${card.cardId}`}
              alt="QR Code"
              className="w-48 h-48"
            />
          </div>

          <h4 className="font-medium text-gray-900 mb-1">{card.fullName}</h4>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Scan to save contact details or share using the options below.
          </p>

          <div className="grid grid-cols-3 gap-4 w-full">
            <a
              href={`https://wa.me/?text=Check out my digital card: nexcard.com/u/${card.cardId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Phone size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">
                WhatsApp
              </span>
            </a>
            <a
              href={`mailto:?subject=My Digital Card&body=Here is my digital business card: nexcard.com/u/${card.cardId}`}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Mail size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">Email</span>
            </a>
            <button
              onClick={handleDownloadQR}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Download size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">
                Download
              </span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Powered by Nexcard</p>
        </div>
      </div>
    </div>
  );
};
export default ShareModal;
