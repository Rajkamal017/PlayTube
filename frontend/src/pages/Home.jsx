import React, { useState } from "react";
import logo from "../assets/PlayTube_Circle.png";
import {
  FaBars,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
  FaUserCircle,
  FaRegFolderOpen,
  FaBookmark,
  FaWallet,
} from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../components/Profile";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, channelData } = useSelector((state) => state.user);
  const { allVideosData } = useSelector((state) => state.content);
  const [popup, setPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Music",
    "Gaming",
    "Movies",
    "TV Shows",
    "News",
    "Trending",
    "Entertainment",
    "Education",
    "Science & Tech",
    "Travel",
    "Fashion",
    "Cooking",
    "Sports",
    "Pets",
    "Art",
    "Comedy",
    "Vlogs",
  ];

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      {/* Navbar */}
      <header className="bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              className="text-xl bg-[#272727] p-2 rounded-full md:inline hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars />
            </button>
            <div className="flex items-center gap-1.25">
              <img src={logo} alt="" className="w-7.5" />
              <span className="text-white font-bold text-xl tracking-tight font-roboto">
                PlayTube
              </span>
            </div>
          </div>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="hidden md:flex items-center gap-2 flex-1 max-w-xl"
          >
            <div className="flex flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700 text-white"
                placeholder="Search"
              />
              <button
                type="submit"
                className="bg-[#272727] px-4 py-2 rounded-r-full border border-gray-700 cursor-pointer"
              >
                <FaSearch />
              </button>
            </div>
            <button
              type="button"
              className="bg-[#272727] p-3 rounded-full"
            >
              <FaMicrophone />
            </button>
          </form>

          {/* Right */}
          <div className="flex items-center gap-3">
            {userData?.channel && (
              <button
                className="hidden md:flex items-center gap-1 bg-[#1f1f1f] px-3 py-1 rounded-full cursor-pointer"
                onClick={() => navigate("/create")}
              >
                <span className="text-lg ">+</span>
                <span>Create</span>
              </button>
            )}
            {!userData?.photoUrl ? (
              <FaUserCircle
                className="text-3xl hidden md:flex text-gray-400 profile-btn cursor-pointer"
                onClick={() => setPopup((prev) => !prev)}
              />
            ) : (
              <img
                src={userData?.photoUrl}
                className="w-9 h-9 rounded-full object-fit-cover border border-gray-700 hidden md:flex profile-btn cursor-pointer"
                onClick={() => setPopup((prev) => !prev)}
              />
            )}
            <FaSearch className="text-lg md:hidden flex" />
          </div>
        </div>
      </header>

      {/* SideBar */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-15 bottom-0 z-40 ${sidebarOpen ? "w-60" : "w-20"} hidden md:flex flex-col overflow-y-auto`}
      >
        <nav className="space-y-1 mt-3">
          <SidebarItem
            icon={<FaHome />}
            text={"Home"}
            open={sidebarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
          />
          <SidebarItem
            icon={<SiYoutubeshorts />}
            text={"Shorts"}
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }} // IMP line
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text={"Subscriptions"}
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {
              setSelectedItem("Subscriptions");
              navigate("/subscriptions");
            }}
          />
        </nav>
        <hr className="border-gray-800 my-3" />

        {sidebarOpen && <p className="text-sm text-gray-400 px-2">You</p>}
        <nav className="space-y-1 mt-3">
          <SidebarItem
            icon={<FaHistory />}
            text={"History"}
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => {
              setSelectedItem("History");
              navigate("/history");
            }}
          />
          <SidebarItem
            icon={<FaList />}
            text={"Playlists"}
            open={sidebarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => {
              if (!userData) {
                showCustomAlert("Please sign in to view your playlists.");
                return;
              }
              const userChannelId = userData.channel || (channelData && channelData._id);
              if (!userChannelId) {
                showCustomAlert("Please create a channel first to view your playlists.");
                navigate("/createchannel");
                return;
              }
              setSelectedItem("Playlists");
              navigate(`/channel/${userChannelId}?tab=Playlists`);
            }}
          />
          <SidebarItem
            icon={<FaBookmark />}
            text={"Save Videos"}
            open={sidebarOpen}
            selected={selectedItem === "Save Videos"}
            onClick={() => {
              setSelectedItem("Save Videos");
              navigate("/saved");
            }}
          />
          <SidebarItem
            icon={<FaWallet />}
            text={"Wallet"}
            open={sidebarOpen}
            selected={selectedItem === "Wallet"}
            onClick={() => {
              setSelectedItem("Wallet");
              navigate("/wallet");
            }}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text={"Liked Videos"}
            open={sidebarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => {
              setSelectedItem("Liked Videos");
              navigate("/liked");
            }}
          />
        </nav>

        <hr className="border-gray-800 my-3" />
        {sidebarOpen && (
          <p className="text-sm text-gray-400 px-2">Subscriptions</p>
        )}
      </aside>

      {/* Main Area */}
      <main
        className={`overflow-y-auto p-4 flex flex-col pb-16 transitions-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-20"}`}
      >
        {location.pathname === "/" && (
          <div className="flex flex-col gap-6 mt-15">
            {/* Categories */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pt-2">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className="whitespace-nowrap bg-[#272727] px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 cursor-pointer transition"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Grid */}
            {allVideosData && allVideosData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                {allVideosData.map((video) => {
                  if (!video) return null;
                  return (
                    <Link
                      to={`/watch/${video._id}`}
                      key={video._id}
                      className="flex flex-col gap-2.5 group cursor-pointer bg-transparent transition duration-300"
                    >
                      {/* Video Thumbnail */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative border border-gray-800/30">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300" />
                      </div>

                      {/* Video Details */}
                      <div className="flex gap-3 px-1 mt-1">
                        {/* Channel Avatar */}
                        {video.channel && (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/channel/${video.channel._id}`);
                            }}
                            className="w-9 h-9 rounded-full overflow-hidden bg-[#1c1c1c] border border-gray-850 shrink-0 hover:opacity-85 transition"
                          >
                            <img
                              src={video.channel.avatar || "https://via.placeholder.com/150"}
                              alt={video.channel.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition line-clamp-2 leading-snug">
                            {video.title}
                          </h3>
                          {video.channel && (
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/channel/${video.channel._id}`);
                              }}
                              className="text-xs text-gray-400 hover:text-white transition cursor-pointer"
                            >
                              {video.channel.name}
                            </span>
                          )}
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <span>{video.views || 0} views</span>
                            <span>•</span>
                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center text-center py-24 space-y-4">
                <div className="bg-[#1c1c1c] text-gray-500 p-6 rounded-full border border-gray-800">
                  <FaRegFolderOpen size={48} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-300">No videos found</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    There are no videos uploaded to PlayTube yet. Click "Create" to upload a new video!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {popup && <Profile onClose={() => setPopup(false)} />}
        <div className="mt-2"></div>
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-10">
        <MobileSizeNav
          icon={<FaHome />}
          text={"Home"}
          active={active === "Home"}
          on
          onClick={() => {
            setActive("Home");
            navigate("/");
          }}
        />
        <MobileSizeNav
          icon={<SiYoutubeshorts />}
          text={"Shorts"}
          active={active === "Shorts"}
          on
          onClick={() => setActive("Shorts")}
        />
        <MobileSizeNav
          icon={<IoIosAddCircle size={40} />}
          active={active === "+"}
          on
          onClick={() => {
            setActive("+");
            navigate("/create");
          }}
        />
        <MobileSizeNav
          icon={<MdOutlineSubscriptions />}
          text={"Subscriptions"}
          active={active === "Subscriptions"}
          on
          onClick={() => {
            setActive("Subscriptions");
            navigate("/subscriptions");
          }}
        />
        <MobileSizeNav
          icon={
            !userData?.photoUrl ? (
              <FaUserCircle />
            ) : (
              <img
                src={userData.photoUrl}
                className="w-8 h-8 rounded-full object-fit-cover border border-gray-700"
              />
            )
          }
          text={"You"}
          active={active === "You"}
          on
          onClick={() => {
            setActive("You");
            navigate("/mobilepro");
          }}
        />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, text, open, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${open ? "justify-start" : "justify-center"} ${selected ? "bg-[#272727]" : "hover:bg-[#272727]"}`}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </button>
  );
}

function MobileSizeNav({ icon, text, onClick, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transitions-all duration-300 ${active ? "text-white" : "text-gray-400"} hover:scale-105`}
      onClick={onClick}
    >
      <span className="text-2xl">{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
}

export default Home;
