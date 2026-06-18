import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaRegFolderOpen, FaVideo, FaInfoCircle } from "react-icons/fa";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");

  useEffect(() => {
    const fetchChannelDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/user/channel/${channelId}`, {
          withCredentials: true,
        });
        const channelData = response.data.channel;
        setChannel(channelData);
        setSubscribersCount(channelData.subscribers?.length || 0);

        if (userData && channelData.subscribers) {
          setIsSubscribed(channelData.subscribers.includes(userData._id));
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Error fetching channel details:", error);
        showCustomAlert("Failed to load channel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [channelId, userData]);

  const handleSubscribeToggle = async () => {
    if (!userData) {
      showCustomAlert("Please sign in to subscribe to channels.");
      return;
    }
    if (channel?.owner === userData._id) {
      showCustomAlert("You cannot subscribe to your own channel.");
      return;
    }

    setSubscribeLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/user/channel/${channelId}/subscribe`,
        {},
        { withCredentials: true }
      );
      setIsSubscribed(response.data.isSubscribed);
      setSubscribersCount(response.data.subscribersCount);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Error occurred while updating subscription.";
      showCustomAlert(errorMsg);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const isOwner = userData && channel?.owner === userData._id;

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <ClipLoader color="#a855f7" size={50} />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-5 bg-[#0f0f0f] text-white min-h-screen">
        <div className="bg-[#1c1c1c] text-gray-500 p-6 rounded-full border border-gray-800">
          <FaRegFolderOpen size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-300">Channel not found</h2>
        <Link
          to="/"
          className="bg-[#272727] hover:bg-[#323232] px-6 py-2.5 rounded-full text-sm font-semibold border border-gray-800 transition text-white"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Section */}
        <div className="w-full aspect-[6/1] rounded-2xl overflow-hidden border border-gray-800/60 shadow-lg relative bg-[#181818]">
          {channel.banner ? (
            <img
              src={channel.banner}
              alt="Channel Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-900 via-purple-950/20 to-gray-900" />
          )}
        </div>

        {/* Profile Info Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 px-4 md:px-8 -mt-10 md:-mt-14 z-10 relative">
          <img
            src={channel.avatar || "https://via.placeholder.com/150"}
            alt={channel.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#0f0f0f] shadow-2xl bg-[#1c1c1c]"
          />
          <div className="flex-1 text-center md:text-left mt-3 md:mt-16 space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{channel.name}</h1>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 text-sm text-gray-400">
              <span className="font-semibold text-purple-400">{channel.category}</span>
              <span>•</span>
              <span>{subscribersCount} subscribers</span>
              <span>•</span>
              <span>{channel.videos?.length || 0} videos</span>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
              {channel.description || "No description available for this channel."}
            </p>
          </div>

          <div className="mt-4 md:mt-16 flex items-center justify-center">
            {isOwner ? (
              <button
                onClick={() => navigate("/updatechannel")}
                className="bg-[#272727] hover:bg-[#383838] border border-gray-700 text-white px-6 py-2 rounded-full font-bold cursor-pointer transition text-sm shadow-md"
              >
                Customize Channel
              </button>
            ) : (
              <button
                onClick={handleSubscribeToggle}
                disabled={subscribeLoading}
                className={`px-6 py-2 rounded-full font-bold transition text-sm shadow-md cursor-pointer flex items-center gap-2 ${
                  isSubscribed
                    ? "bg-[#272727] hover:bg-red-950/40 hover:text-red-500 border border-gray-700 text-gray-300"
                    : "bg-white hover:bg-purple-100 text-black"
                }`}
              >
                {subscribeLoading ? (
                  <ClipLoader color={isSubscribed ? "#ffffff" : "#000000"} size={14} />
                ) : isSubscribed ? (
                  "Subscribed"
                ) : (
                  "Subscribe"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-800/80 pt-6">
          <div className="flex gap-8 px-2">
            {["Videos", "About"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === tab
                    ? "border-purple-500 text-white font-extrabold"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="pt-4">
          {activeTab === "Videos" && (
            <div>
              {channel.videos && channel.videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {channel.videos.map((video) => (
                    <Link
                      to={`/watch/${video._id}`}
                      key={video._id}
                      className="flex flex-col gap-2 group cursor-pointer"
                    >
                      {/* Thumbnail Container */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative border border-gray-800/30">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300" />
                      </div>
                      
                      {/* Text details */}
                      <div className="flex flex-col gap-1 mt-1 px-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition line-clamp-2 leading-snug">
                          {video.title}
                        </h3>
                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <span>{video.views || 0} views</span>
                          <span>•</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty Videos State */
                <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                  <div className="bg-[#181818] text-gray-600 p-5 rounded-full border border-gray-800">
                    <FaVideo size={36} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-300">This channel has no videos yet</h3>
                    <p className="text-sm text-gray-500">Check back later for new content updates.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "About" && (
            <div className="bg-[#141414] border border-gray-800/60 p-6 rounded-2xl max-w-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-purple-400">
                <FaInfoCircle className="text-lg" />
                <h3 className="text-base font-bold uppercase tracking-wider">About Channel</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase">Description</h4>
                  <p className="text-sm text-gray-300 mt-1 whitespace-pre-line leading-relaxed">
                    {channel.description || "No description provided."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-800">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Category</h4>
                    <p className="text-sm text-gray-200 mt-0.5">{channel.category}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Joined</h4>
                    <p className="text-sm text-gray-200 mt-0.5">
                      {new Date(channel.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChannelPage;
