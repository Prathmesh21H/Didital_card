import { Edit, Share2 } from "lucide-react";
const getAvatarUrl = (u) => {
  if (u?.profileUrl) return u.profileUrl;
  if (u?.fullName)
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.fullName}`;
  return "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";
};
const CardItem = ({ card, onEdit, onShare }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-24 relative" style={getBannerStyle(card.banner)}>
        <div className="absolute -bottom-8 left-6">
          <img
            src={
              card.profileUrl ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${card.fullName}`
            }
            alt="Profile"
            className="w-16 h-16 rounded-lg border-4 border-white shadow-sm bg-white object-cover"
          />
        </div>
      </div>

      <div className="pt-10 px-6 pb-6">
        <h3 className="text-lg font-bold text-gray-800">{card.fullName}</h3>
        <p className="text-blue-600 font-medium text-sm">{card.designation}</p>
        <p className="text-gray-500 text-sm mt-1">{card.company}</p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onEdit(card.cardId)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all font-medium text-sm"
          >
            <Edit size={16} /> Edit
          </button>
          <button
            onClick={() => onShare(card)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all font-medium text-sm"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};
export default CardItem;
