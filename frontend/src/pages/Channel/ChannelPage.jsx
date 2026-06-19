import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaRegFolderOpen, FaVideo, FaInfoCircle, FaEdit, FaTrash, FaList } from "react-icons/fa";
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

  // Edit / Delete Modal State
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnailFile, setEditThumbnailFile] = useState(null);
  const [editThumbnailPreview, setEditThumbnailPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEditModal = (video) => {
    setSelectedVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description || "");
    setEditThumbnailFile(null);
    setEditThumbnailPreview(video.thumbnail);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (video) => {
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      showCustomAlert("Title is required");
      return;
    }
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);
      if (editThumbnailFile) {
        formData.append("thumbnail", editThumbnailFile);
      }

      await axios.put(`${serverUrl}/api/content/video/${selectedVideo._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      showCustomAlert("Video updated successfully!");
      setIsEditModalOpen(false);
      
      const response = await axios.get(`${serverUrl}/api/user/channel/${channelId}`, {
        withCredentials: true,
      });
      setChannel(response.data.channel);
    } catch (error) {
      console.error("Error updating video:", error);
      const errorMsg = error.response?.data?.message || "Failed to update video.";
      showCustomAlert(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${serverUrl}/api/content/video/${selectedVideo._id}`, {
        withCredentials: true,
      });

      showCustomAlert("Video deleted successfully!");
      setIsDeleteModalOpen(false);

      const response = await axios.get(`${serverUrl}/api/user/channel/${channelId}`, {
        withCredentials: true,
      });
      setChannel(response.data.channel);
    } catch (error) {
      console.error("Error deleting video:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete video.";
      showCustomAlert(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isDeletePlaylistModalOpen, setIsDeletePlaylistModalOpen] = useState(false);
  const [deletingPlaylist, setDeletingPlaylist] = useState(false);

  const openDeletePlaylistConfirm = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsDeletePlaylistModalOpen(true);
  };

  const handleDeletePlaylistSubmit = async () => {
    setDeletingPlaylist(true);
    try {
      await axios.delete(`${serverUrl}/api/playlist/${selectedPlaylist._id}`, {
        withCredentials: true,
      });

      showCustomAlert("Playlist deleted successfully!");
      setIsDeletePlaylistModalOpen(false);

      const response = await axios.get(`${serverUrl}/api/user/channel/${channelId}`, {
        withCredentials: true,
      });
      setChannel(response.data.channel);
    } catch (error) {
      console.error("Error deleting playlist:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete playlist.";
      showCustomAlert(errorMsg);
    } finally {
      setDeletingPlaylist(false);
    }
  };

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
            {["Videos", "Playlists", "About"].map((tab) => (
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
                        {isOwner && (
                          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openEditModal(video);
                              }}
                              className="bg-black/80 hover:bg-purple-600 text-white p-2 rounded-full transition shadow-md border border-gray-800 cursor-pointer"
                              title="Edit Video"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openDeleteConfirm(video);
                              }}
                              className="bg-black/80 hover:bg-red-600 text-white p-2 rounded-full transition shadow-md border border-gray-800 cursor-pointer"
                              title="Delete Video"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        )}
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

          {activeTab === "Playlists" && (
            <div>
              {channel.playlists && channel.playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {channel.playlists.map((playlist) => (
                    <Link
                      to={`/playlist/${playlist._id}`}
                      key={playlist._id}
                      className="flex flex-col gap-2 group cursor-pointer"
                    >
                      {/* Playlist Stack Representation */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#1c1c1c] relative border border-gray-800/30">
                        {/* Background Stack effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent z-10" />
                        
                        <div className="absolute inset-0 flex flex-col justify-between p-4 z-20">
                          <div className="flex justify-between items-start w-full">
                            <div className="bg-purple-600/90 text-white p-2.5 rounded-xl shadow-md border border-purple-500/30">
                              <FaList size={18} />
                            </div>
                            
                            {/* Actions Overlay */}
                            {isOwner && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openDeletePlaylistConfirm(playlist);
                                }}
                                className="bg-black/80 hover:bg-red-600 text-white p-2 rounded-full transition shadow-md border border-gray-800 cursor-pointer"
                                title="Delete Playlist"
                              >
                                <FaTrash size={12} />
                              </button>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="bg-black/70 px-3 py-1 rounded-full text-xs font-bold text-gray-200 border border-gray-800">
                              {playlist.videos?.length || 0} videos
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="flex flex-col gap-1 mt-1 px-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition line-clamp-1 leading-snug">
                          {playlist.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {playlist.description || "No description."}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty Playlists State */
                <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                  <div className="bg-[#181818] text-gray-600 p-5 rounded-full border border-gray-800">
                    <FaList size={36} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-300">No playlists created yet</h3>
                    {isOwner && (
                      <p className="text-sm text-gray-500">
                        Click "+ Create" to make your first playlist.
                      </p>
                    )}
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

        {/* Edit Video Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#121212] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#181818]">
                <h3 className="text-lg font-bold text-white">Edit Video Details</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-white transition cursor-pointer text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Video Title"
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Video Description"
                    rows="4"
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition resize-none"
                  />
                </div>

                {/* Thumbnail File & Preview */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thumbnail</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {editThumbnailPreview && (
                      <img
                        src={editThumbnailPreview}
                        alt="Preview"
                        className="w-32 aspect-video object-cover rounded-lg border border-gray-800 bg-[#0f0f0f]"
                      />
                    )}
                    <div className="w-full flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setEditThumbnailFile(file);
                            setEditThumbnailPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                        id="edit-thumbnail-input"
                      />
                      <label
                        htmlFor="edit-thumbnail-input"
                        className="block text-center bg-[#272727] hover:bg-[#383838] border border-gray-700 text-white py-2 rounded-xl text-xs font-bold cursor-pointer transition shadow-md"
                      >
                        Change Thumbnail
                      </label>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    {updating ? <ClipLoader color="#ffffff" size={12} /> : null}
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#121212] border border-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="p-6 space-y-6 text-center">
                <div className="bg-red-950/20 text-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-red-900/30">
                  <FaTrash size={24} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Delete Video?</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Are you sure you want to delete <span className="text-white font-semibold">"{selectedVideo?.title}"</span>? This action cannot be undone and will permanently delete the video and its thumbnail.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="bg-[#272727] hover:bg-[#383838] border border-gray-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition w-1/2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSubmit}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition w-1/2 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {deleting ? <ClipLoader color="#ffffff" size={12} /> : null}
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Playlist Confirmation Modal */}
        {isDeletePlaylistModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#121212] border border-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="p-6 space-y-6 text-center">
                <div className="bg-red-950/20 text-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-red-900/30">
                  <FaTrash size={24} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Delete Playlist?</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Are you sure you want to delete <span className="text-white font-semibold">"{selectedPlaylist?.title}"</span>? This action cannot be undone and will permanently delete this playlist.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeletePlaylistModalOpen(false)}
                    className="bg-[#272727] hover:bg-[#383838] border border-gray-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition w-1/2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePlaylistSubmit}
                    disabled={deletingPlaylist}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition w-1/2 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {deletingPlaylist ? <ClipLoader color="#ffffff" size={12} /> : null}
                    {deletingPlaylist ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChannelPage;
