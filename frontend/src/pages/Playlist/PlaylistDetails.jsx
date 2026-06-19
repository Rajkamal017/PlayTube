import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaPlay, FaTrash, FaList, FaRegFolderOpen, FaArrowLeft } from "react-icons/fa";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingVideoId, setRemovingVideoId] = useState(null);

  const fetchPlaylistDetails = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/playlist/${playlistId}`);
      setPlaylist(response.data.playlist);
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      showCustomAlert("Failed to load playlist details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    setRemovingVideoId(videoId);
    try {
      await axios.delete(`${serverUrl}/api/playlist/${playlistId}/video/${videoId}`, {
        withCredentials: true,
      });
      showCustomAlert("Video removed from playlist.");
      fetchPlaylistDetails();
    } catch (error) {
      console.error("Error removing video from playlist:", error);
      const errorMsg = error.response?.data?.message || "Failed to remove video.";
      showCustomAlert(errorMsg);
    } finally {
      setRemovingVideoId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-[#0f0f0f]">
        <ClipLoader color="#a855f7" size={50} />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-5 bg-[#0f0f0f] text-white min-h-screen">
        <div className="bg-[#1c1c1c] text-gray-500 p-6 rounded-full border border-gray-800">
          <FaRegFolderOpen size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-300">Playlist not found</h2>
        <Link
          to="/"
          className="bg-[#272727] hover:bg-[#323232] px-6 py-2.5 rounded-full text-sm font-semibold border border-gray-800 transition text-white"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  const isOwner = userData && playlist.channel?.owner === userData._id;

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Playlist Info Sidebar / Header */}
        <div className="w-full lg:w-[360px] bg-gradient-to-b from-[#181818] to-[#121212] rounded-2xl p-6 border border-gray-800/60 shadow-xl flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-xs font-semibold cursor-pointer w-fit"
          >
            <FaArrowLeft size={10} />
            <span>Back</span>
          </button>

          {/* Playlist Thumbnail representation */}
          <div className="aspect-video w-full rounded-xl bg-purple-900/10 border border-purple-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/10 to-black/80 z-10" />
            <FaList size={40} className="text-purple-400 z-20" />
            <div className="absolute bottom-4 left-4 z-20">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-800/40">
                Playlist
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              {playlist.title}
            </h1>
            
            {playlist.channel && (
              <Link
                to={`/channel/${playlist.channel._id}`}
                className="flex items-center gap-3 group/channel"
              >
                <img
                  src={playlist.channel.avatar || "https://via.placeholder.com/40"}
                  alt={playlist.channel.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-800"
                />
                <span className="text-sm font-bold text-gray-300 group-hover/channel:text-white transition">
                  {playlist.channel.name}
                </span>
              </Link>
            )}

            <div className="flex gap-3 text-xs text-gray-400 font-medium">
              <span>{playlist.videos?.length || 0} videos</span>
              <span>•</span>
              <span>Updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed whitespace-pre-line pt-2">
              {playlist.description || "No description available."}
            </p>
          </div>

          {playlist.videos && playlist.videos.length > 0 && (
            <Link
              to={`/watch/${playlist.videos[0]._id}`}
              className="w-full bg-white hover:bg-gray-100 text-black py-3 rounded-full font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <FaPlay size={12} />
              <span>Play All</span>
            </Link>
          )}
        </div>

        {/* Videos List Section */}
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white pb-2 border-b border-gray-800">
            Videos
          </h2>

          {playlist.videos && playlist.videos.length > 0 ? (
            <div className="flex flex-col gap-4">
              {playlist.videos.map((video, index) => (
                <div
                  key={video._id}
                  className="flex items-center gap-4 bg-[#141414]/40 hover:bg-[#181818]/60 p-3 rounded-2xl border border-gray-800/30 transition group relative"
                >
                  {/* Video Index */}
                  <span className="text-sm font-bold text-gray-500 w-4 text-center">
                    {index + 1}
                  </span>

                  {/* Video Link wrapper */}
                  <Link
                    to={`/watch/${video._id}`}
                    className="flex flex-1 flex-col sm:flex-row gap-4 cursor-pointer"
                  >
                    <div className="w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-black border border-gray-800/40 relative shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-1 sm:py-1">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-400 transition line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                      <div className="text-xs text-gray-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-gray-300">
                          {video.channel?.name}
                        </span>
                        <span>•</span>
                        <span>{video.views || 0} views</span>
                        <span>•</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed hidden sm:block">
                        {video.description}
                      </p>
                    </div>
                  </Link>

                  {/* Remove Button for Owner */}
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveVideo(video._id)}
                      disabled={removingVideoId === video._id}
                      className="text-gray-400 hover:text-red-500 p-2.5 rounded-full hover:bg-red-950/20 transition cursor-pointer border border-transparent hover:border-red-900/30 z-20 shrink-0"
                      title="Remove from Playlist"
                    >
                      {removingVideoId === video._id ? (
                        <ClipLoader color="#ef4444" size={14} />
                      ) : (
                        <FaTrash size={14} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-24 space-y-4 bg-[#141414]/30 rounded-2xl border border-gray-800/30">
              <div className="bg-[#181818] text-gray-600 p-5 rounded-full border border-gray-800">
                <FaRegFolderOpen size={36} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-300">This playlist is empty</h3>
                <p className="text-sm text-gray-500">Go to any video to add it here.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PlaylistDetails;
