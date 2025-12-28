const BANNER_IMAGE_URL =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop";

const getBannerStyle = (banner) => {
  if (!banner) return { backgroundColor: "#2563EB" };
  if (banner.type === "image") {
    return {
      backgroundImage: `url(${banner.value})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { background: banner.value };
};

export default getBannerStyle;
