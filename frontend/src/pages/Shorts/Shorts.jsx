import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaThumbsUp, FaRegThumbsUp, FaChevronUp, FaChevronDown, FaShare, FaVideo } from "react-icons/fa";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const Shorts = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [shorts, setShorts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const fetchShorts = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/content/get-all-shorts`);
      setShorts(response.data.shorts || []);
    } catch (error) {
      console.error("Error fetching shorts:", error);
      showCustomAlert("Failed to load shorts feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const activeShort = shorts[activeIndex];

  useEffect(() => {
    if (!activeShort) return;
    const incrementView = async () => {
      try {
        await axios.post(`${serverUrl}/api/content/short/${activeShort._id}/view`, {}, { withCredentials: true });
      } catch (error) {
        console.error("Failed to increment short view:", error);
      }
    };
    incrementView();
  }, [activeIndex, shorts]);

  const handleLikeToggle = async () => {
    if (!userData) {
      showCustomAlert("Please sign in to like shorts.");
      return;
    }
    if (!activeShort) return;

    setLikeLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/content/short/${activeShort._id}/like`,
        {},
        { withCredentials: true }
      );
      
      const updatedShorts = [...shorts];
      updatedShorts[activeIndex] = {
        ...activeShort,
        likes: response.data.likes
      };
      setShorts(updatedShorts);
    } catch (error) {
      console.error("Error liking short:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleNext = () => {
    if (activeIndex < shorts.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-[#0f0f0f]">
        <ClipLoader color="#a855f7" size={50} />
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-5 bg-[#0f0f0f] text-white min-h-screen">
        <div className="bg-[#1c1c1c] text-gray-500 p-6 rounded-full border border-gray-800">
          <FaVideo size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-300">No shorts available</h2>
        <Link
          to="/"
          className="bg-[#272727] hover:bg-[#323232] px-6 py-2.5 rounded-full text-sm font-semibold border border-gray-800 transition text-white"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  const isLiked = userData && activeShort.likes?.includes(userData._id);

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white pt-20 pb-12 flex justify-center items-center px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row items-center gap-6 relative max-w-lg w-full">
        
        {/* Navigation Keys for Desktop */}
        <div className="hidden lg:flex flex-col gap-3 absolute -left-16 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="bg-[#1c1c1c]/80 hover:bg-[#2c2c2c] border border-gray-800 p-3.5 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg cursor-pointer"
          >
            <FaChevronUp size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === shorts.length - 1}
            className="bg-[#1c1c1c]/80 hover:bg-[#2c2c2c] border border-gray-800 p-3.5 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg cursor-pointer"
          >
            <FaChevronDown size={16} />
          </button>
        </div>

        {/* Immersive Vertical Player Wrapper */}
        <div className="w-full aspect-[9/16] max-h-[75vh] bg-black rounded-2xl overflow-hidden border border-gray-800/80 shadow-2xl relative flex items-center justify-center">
          <video
            key={activeShort._id}
            src={activeShort.shortUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            loop
            playsInline
          />

          {/* Bottom details overlay */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 space-y-3 text-left">
            
            {/* Channel info */}
            {activeShort.channel && (
              <div className="flex items-center gap-3">
                <Link to={`/channel/${activeShort.channel._id}`}>
                  <img
                    src={activeShort.channel.avatar || "https://via.placeholder.com/40"}
                    alt={activeShort.channel.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-700/60 shadow-md bg-[#1a1a1a]"
                  />
                </Link>
                <div className="flex flex-col min-w-0">
                  <Link
                    to={`/channel/${activeShort.channel._id}`}
                    className="text-sm font-bold text-white truncate hover:text-purple-400 transition"
                  >
                    @{activeShort.channel.name}
                  </Link>
                  <span className="text-[10px] text-gray-400">
                    {activeShort.channel.subscribers?.length || 0} subscribers
                  </span>
                </div>
              </div>
            )}

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white line-clamp-1">{activeShort.title}</h3>
              {activeShort.description && (
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-sans">
                  {activeShort.description}
                </p>
              )}
            </div>

            {/* Views counter */}
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              {activeShort.views || 0} views
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex flex-row lg:flex-col gap-4 items-center justify-center z-20">
          {/* Like Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleLikeToggle}
              disabled={likeLoading}
              className={`p-3.5 rounded-full transition shadow-md border cursor-pointer ${
                isLiked
                  ? "bg-purple-600 text-white border-purple-500 hover:bg-purple-700"
                  : "bg-[#1c1c1c]/80 text-gray-300 border-gray-800 hover:bg-[#2c2c2c]"
              }`}
            >
              <FaThumbsUp size={16} />
            </button>
            <span className="text-xs font-bold text-gray-400">{activeShort.likes?.length || 0}</span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + `/shorts`);
                showCustomAlert("Shorts link copied to clipboard!");
              }}
              className="bg-[#1c1c1c]/80 text-gray-300 border border-gray-800 p-3.5 rounded-full hover:bg-[#2c2c2c] transition shadow-md cursor-pointer"
            >
              <FaShare size={16} />
            </button>
            <span className="text-xs font-bold text-gray-400">Share</span>
          </div>

          {/* Mobile Navigation controls */}
          <div className="flex lg:hidden gap-3">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="bg-[#1c1c1c]/80 text-gray-300 border border-gray-800 p-3 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              <FaChevronUp size={14} />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === shorts.length - 1}
              className="bg-[#1c1c1c]/80 text-gray-300 border border-gray-800 p-3 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              <FaChevronDown size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shorts;