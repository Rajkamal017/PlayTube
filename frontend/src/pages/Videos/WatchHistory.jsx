import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaHistory, FaRegFolderOpen } from "react-icons/fa";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/user/watch-history`, {
          withCredentials: true,
        });
        setHistory(response.data.history || []);
      } catch (error) {
        console.error("Error fetching watch history:", error);
        showCustomAlert("Failed to load watch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <ClipLoader color="#a855f7" size={50} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="border-b border-[#2d2d2d] pb-4 flex items-center gap-3">
          <FaHistory className="text-gray-400 text-lg" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Watch History</h1>
        </div>

        {/* Results Feed */}
        {history.length > 0 ? (
          <div className="space-y-6">
            {history.map((video) => {
              if (!video) return null;
              return (
                <Link
                  to={`/watch/${video._id}`}
                  key={video._id}
                  className="flex flex-col sm:flex-row gap-5 group bg-transparent hover:bg-[#161616] p-3 rounded-2xl border border-transparent hover:border-gray-800/40 transition duration-300 cursor-pointer"
                >
                  {/* Video Thumbnail */}
                  <div className="w-full sm:w-72 md:w-80 aspect-video rounded-xl overflow-hidden bg-black flex-shrink-0 relative border border-gray-800/30">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300" />
                  </div>

                  {/* Video Details */}
                  <div className="flex flex-col justify-start space-y-2.5 overflow-hidden py-1">
                    <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-400 transition leading-snug line-clamp-2">
                      {video.title}
                    </h2>

                    {/* Views & Timestamp */}
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{video.views || 0} views</span>
                      <span>•</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Channel Metadata */}
                    {video.channel && (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/channel/${video.channel._id}`);
                        }}
                        className="flex items-center gap-2 pt-1 hover:opacity-80 transition cursor-pointer"
                      >
                        <img
                          src={video.channel.avatar || "https://via.placeholder.com/150"}
                          alt={video.channel.name}
                          className="w-6 h-6 rounded-full object-cover border border-gray-800"
                        />
                        <span className="text-sm font-semibold text-gray-300 hover:text-white transition">
                          {video.channel.name}
                        </span>
                      </div>
                    )}

                    {/* Description Snippet */}
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed max-w-2xl">
                      {video.description || "No description available."}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-5">
            <div className="bg-[#1c1c1c] text-gray-500 p-6 rounded-full border border-gray-800 animate-pulse">
              <FaRegFolderOpen size={48} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-gray-300">Watch history is empty</h2>
              <p className="text-sm text-gray-500 max-w-sm">
                Videos you watch will be shown here. Start exploring some amazing content!
              </p>
            </div>
            <Link
              to="/"
              className="bg-[#272727] hover:bg-[#323232] px-6 py-2.5 rounded-full text-sm font-semibold border border-gray-800 transition text-white"
            >
              Go Back Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
