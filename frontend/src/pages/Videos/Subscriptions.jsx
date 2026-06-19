import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaRegFolderOpen } from "react-icons/fa";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const Subscriptions = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscribedVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/user/subscriptions/videos`, {
          withCredentials: true,
        });
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Error fetching subscribed videos:", error);
        showCustomAlert("Failed to load subscriptions feed.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedVideos();
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
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="border-b border-gray-800 pb-4 flex items-center gap-3">
          <MdOutlineSubscriptions className="text-purple-400 text-xl" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Subscriptions</h1>
        </div>

        {/* Video Grid Feed */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => {
              if (!video) return null;
              return (
                <Link
                  to={`/watch/${video._id}`}
                  key={video._id}
                  className="flex flex-col gap-2.5 group cursor-pointer bg-[#141414]/30 hover:bg-[#161616] p-3 rounded-2xl border border-transparent hover:border-gray-800/40 transition duration-300"
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
                  <div className="flex flex-col gap-2 px-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition line-clamp-2 leading-snug">
                      {video.title}
                    </h3>

                    {/* Channel Metadata & Info */}
                    {video.channel && (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/channel/${video.channel._id}`);
                        }}
                        className="flex items-center gap-2 pt-0.5 hover:opacity-80 transition cursor-pointer"
                      >
                        <img
                          src={video.channel.avatar || "https://via.placeholder.com/150"}
                          alt={video.channel.name}
                          className="w-5 h-5 rounded-full object-cover border border-gray-800"
                        />
                        <span className="text-xs font-semibold text-gray-400 hover:text-white transition">
                          {video.channel.name}
                        </span>
                      </div>
                    )}

                    {/* Views & Timestamp */}
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <span>{video.views || 0} views</span>
                      <span>•</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
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
              <h2 className="text-xl font-bold text-gray-300">Subscriptions feed is empty</h2>
              <p className="text-sm text-gray-500 max-w-sm">
                Subscribe to channels to see their latest video uploads appear here.
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

export default Subscriptions;
