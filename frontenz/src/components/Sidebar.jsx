import { X, User, CreditCard, LogOut } from "lucide-react";

const getAvatarUrl = (u) => {
  if (u?.profileUrl) return u.profileUrl;
  if (u?.fullName)
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.fullName}`;
  return "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";
};
const SidebarButton = ({ icon, label }) => (
  <button className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-all group">
    <span className="mr-3 text-gray-400 group-hover:text-blue-600 transition-colors">
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar = ({ isOpen, onClose, user }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center px-6 pb-6 border-b border-gray-100">
            <div className="relative">
              <img
                src={getAvatarUrl(user)}
                alt="Profile Large"
                className="w-24 h-24 rounded-full border-4 border-blue-50 mb-3 object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              {user?.fullName || "Welcome!"}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-1">
              {user?.email || "user@nexcard.com"}
            </p>
            {user?.designation && (
              <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                {user.designation}
              </span>
            )}
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarButton icon={<User size={20} />} label="Edit Profile" />
            <SidebarButton
              icon={<CreditCard size={20} />}
              label="Subscription Plan"
            />
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
              <span className="mr-3">
                <LogOut size={20} />
              </span>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
