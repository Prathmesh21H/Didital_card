const getAvatarUrl = (u) => {
  if (u?.profileUrl) return u.profileUrl;
  if (u?.fullName)
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.fullName}`;
  return "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";
};
const Header = ({ onToggleSidebar, user }) => {
  return (
    <header className="bg-white shadow-sm h-16 fixed w-full top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      <div className="text-xl lg:text-2xl font-bold text-blue-600 tracking-tight cursor-pointer">
        Nexcard
      </div>

      <button
        onClick={onToggleSidebar}
        className="relative focus:outline-none hover:ring-2 hover:ring-blue-100 rounded-full transition-all"
      >
        <img
          src={getAvatarUrl(user)}
          alt="Profile"
          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-gray-200 object-cover"
        />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </button>
    </header>
  );
};
export default Header;
