import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown, FaShare, FaBookmark, FaRegThumbsUp, FaRegThumbsDown, FaTrash, FaUserCircle, FaList, FaCoins } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../../config';
import { showCustomAlert } from '../../components/CustomeAlert';
import { setAllVideosData } from '../../Redux/contentSlice';

const getAmbientGradient = (category) => {
  switch (category?.toLowerCase()) {
    case 'gaming':
      return 'from-[#a855f7]/30 via-[#3b82f6]/20 to-transparent';
    case 'music':
      return 'from-[#ec4899]/30 via-[#06b6d4]/20 to-transparent';
    case 'movies':
    case 'tv shows':
      return 'from-[#eab308]/20 via-[#ef4444]/20 to-transparent';
    case 'science & tech':
    case 'education':
      return 'from-[#14b8a6]/30 via-[#10b981]/25 to-transparent';
    default:
      return 'from-[#a855f7]/35 via-[#6366f1]/25 to-transparent';
  }
};

const WatchVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allVideosData } = useSelector((state) => state.content);
  const { userData, channelData } = useSelector((state) => state.user);

  // States
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [likeState, setLikeState] = useState(null); // 'like', 'dislike', or null
  const [likesCount, setLikesCount] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Playlist Modal State
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);

  // Saved State
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Comments states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsFetching, setCommentsFetching] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);

  // Tipping States
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipLoading, setTipLoading] = useState(false);

  // Fetch active video details
  useEffect(() => {
    const fetchVideoDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/content/video/${videoId}`, {
          withCredentials: true,
        });
        const videoData = response.data.video;
        setVideo(videoData);
        setLikesCount(videoData.likes?.length || 0);

        if (userData && videoData.likes) {
          const userLiked = videoData.likes.includes(userData._id);
          setLikeState(userLiked ? 'like' : null);
        } else {
          setLikeState(null);
        }

        if (videoData.channel) {
          setSubscribersCount(videoData.channel.subscribers?.length || 0);
          if (userData && videoData.channel.subscribers) {
            const userSubscribed = videoData.channel.subscribers.includes(userData._id);
            setIsSubscribed(userSubscribed);
          } else {
            setIsSubscribed(false);
          }
        }
      } catch (error) {
        console.error(error);
        showCustomAlert('Failed to load video details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId, userData]);

  // Automatically increment view count when video is opened
  useEffect(() => {
    const incrementView = async () => {
      try {
        await axios.post(`${serverUrl}/api/content/video/${videoId}/view`, {}, { withCredentials: true });
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };
    incrementView();
  }, [videoId]);

  // Automatically add to watch history when video is opened
  useEffect(() => {
    if (!userData) return;
    const addToHistory = async () => {
      try {
        await axios.post(`${serverUrl}/api/user/watch-history/${videoId}`, {}, { withCredentials: true });
      } catch (error) {
        console.error('Failed to add to watch history:', error);
      }
    };
    addToHistory();
  }, [videoId, userData]);

  // Check if video is saved
  useEffect(() => {
    if (!userData) return;
    const checkSavedStatus = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/saved-videos`, {
          withCredentials: true,
        });
        const savedList = response.data.videos || [];
        setIsSaved(savedList.some(v => v._id === videoId));
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };
    checkSavedStatus();
  }, [videoId, userData]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setCommentsFetching(true);
      try {
        const response = await axios.get(`${serverUrl}/api/content/video/${videoId}/comments`, {
          withCredentials: true,
        });
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setCommentsFetching(false);
      }
    };
    fetchComments();
  }, [videoId]);

  // Fetch all videos list if Redux state is empty (for the sidebar)
  useEffect(() => {
    if (!allVideosData || allVideosData.length === 0) {
      const fetchAllVideos = async () => {
        try {
          const response = await axios.get(`${serverUrl}/api/content/get-all-videos`, {
            withCredentials: true,
          });
          dispatch(setAllVideosData(response.data.videos));
        } catch (error) {
          console.error('Failed to load related videos:', error);
        }
      };
      fetchAllVideos();
    }
  }, [allVideosData, dispatch]);

  // Handle Subscribe / Unsubscribe Toggle
  const handleSubscribeToggle = async () => {
    if (!userData) {
      showCustomAlert('Please sign in to subscribe to channels.');
      return;
    }
    if (video?.channel?.owner === userData._id) {
      showCustomAlert('You cannot subscribe to your own channel.');
      return;
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/user/channel/${video.channel?._id}/subscribe`,
        {},
        { withCredentials: true }
      );
      setIsSubscribed(response.data.isSubscribed);
      setSubscribersCount(response.data.subscribersCount);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Error occurred while updating subscription.';
      showCustomAlert(errorMsg);
    }
  };

  // Handle Video Like
  const handleLike = async () => {
    if (!userData) {
      showCustomAlert('Please sign in to like videos.');
      return;
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/content/video/${videoId}/like`,
        {},
        { withCredentials: true }
      );
      setLikeState(response.data.isLiked ? 'like' : null);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error(error);
      showCustomAlert('Failed to update like status.');
    }
  };

  // Handle Comment Submission
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!userData) {
      showCustomAlert('Please sign in to post comments.');
      return;
    }

    setCommentLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/content/video/${videoId}/comment`,
        { message: newComment.trim() },
        { withCredentials: true }
      );
      setComments(response.data.comments || []);
      setNewComment('');
      setInputFocused(false);
    } catch (error) {
      console.error(error);
      showCustomAlert('Failed to post comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle Comment Deletion
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${serverUrl}/api/content/video/${videoId}/comment/${commentId}`,
        { withCredentials: true }
      );
      setComments(response.data.comments || []);
      showCustomAlert('Comment deleted successfully.');
    } catch (error) {
      console.error(error);
      showCustomAlert('Failed to delete comment.');
    }
  };

  const handleOpenPlaylistModal = async () => {
    if (!userData) {
      showCustomAlert("Please sign in to save videos to playlists.");
      return;
    }

    setIsPlaylistModalOpen(true);
    setPlaylistsLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/playlist/user/playlists`, {
        withCredentials: true,
      });
      setUserPlaylists(response.data.playlists || []);
    } catch (error) {
      console.error("Error fetching playlists for modal:", error);
    } finally {
      setPlaylistsLoading(false);
    }
  };

  const handleToggleVideoPlaylist = async (playlist) => {
    const isVideoInPlaylist = playlist.videos?.includes(videoId);
    try {
      if (isVideoInPlaylist) {
        await axios.delete(`${serverUrl}/api/playlist/${playlist._id}/video/${videoId}`, {
          withCredentials: true,
        });
        showCustomAlert(`Removed from playlist "${playlist.title}"`);
      } else {
        await axios.post(`${serverUrl}/api/playlist/${playlist._id}/video/${videoId}`, {}, {
          withCredentials: true,
        });
        showCustomAlert(`Saved to playlist "${playlist.title}"`);
      }

      const response = await axios.get(`${serverUrl}/api/playlist/user/playlists`, {
        withCredentials: true,
      });
      setUserPlaylists(response.data.playlists || []);
    } catch (error) {
      console.error("Error toggling video in playlist:", error);
      showCustomAlert("Failed to update playlist.");
    }
  };

  const handleSaveToggle = async () => {
    if (!userData) {
      showCustomAlert("Please sign in to save videos.");
      return;
    }
    setSaveLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/user/save-video/${videoId}`, {}, {
        withCredentials: true,
      });
      setIsSaved(response.data.isSaved);
      showCustomAlert(response.data.isSaved ? "Video saved to bookmarks!" : "Video removed from bookmarks!");
    } catch (error) {
      console.error("Error toggling save status:", error);
      showCustomAlert("Failed to save video.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTipCreator = async (e) => {
    e.preventDefault();
    if (!userData) {
      showCustomAlert("Please sign in to tip creators.");
      return;
    }

    const amt = parseFloat(tipAmount);
    if (isNaN(amt) || amt <= 0) {
      showCustomAlert("Please enter a valid tip amount.");
      return;
    }

    setTipLoading(true);
    try {
      await axios.post(`${serverUrl}/api/user/tip-creator`, {
        videoId,
        amount: amt
      }, {
        withCredentials: true,
      });

      showCustomAlert(`🎉 Successfully tipped ${amt} PTC to creator!`);
      setIsTipModalOpen(false);
      setTipAmount("");
    } catch (error) {
      console.error("Tipping error:", error);
      const errorMsg = error.response?.data?.message || "Failed to send tip.";
      showCustomAlert(errorMsg);
    } finally {
      setTipLoading(false);
    }
  };

  // Earn crypto rewards after watching for 10 seconds
  useEffect(() => {
    if (!userData || !videoId) return;

    const rewardTimer = setTimeout(async () => {
      try {
        const response = await axios.post(`${serverUrl}/api/user/earn-reward/${videoId}`, {}, {
          withCredentials: true,
        });
        if (response.status === 200) {
          showCustomAlert(`🎉 Congratulations! You earned ${response.data.amount} PTC for watching this video.`);
        }
      } catch (error) {
        console.log("Watch reward claim:", error.response?.data?.message || error.message);
      }
    }, 10000); // 10 seconds watch time trigger

    return () => clearTimeout(rewardTimer);
  }, [videoId, userData]);

  // Render Loader
  if (loading) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <ClipLoader color="#9333ea" size={50} />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-300">Video not found</h2>
        <p className="text-gray-500 mt-2">The video you are trying to watch does not exist or has been deleted.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-full text-sm font-semibold transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Filter out the current playing video from the sidebar recommendations
  const relatedVideos = allVideosData?.filter((v) => v._id !== video._id) || [];

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white pt-16 pb-12 px-2 sm:px-4 lg:px-6">
      <div className="max-w-375 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Video Player & Details (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Video Player Wrapper with Ambient Glow */}
          <div className="relative w-full aspect-video rounded-2xl">
            {/* Ambient Glow Backdrop */}
            <div className={`absolute inset-0 -z-10 rounded-2xl bg-linear-to-tr ${getAmbientGradient(video.channel?.category)} blur-[100px] opacity-45 animate-ambient-glow pointer-events-none`} />
            
            {/* Video Player */}
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-gray-800 shadow-2xl relative">
              <video
                src={video.videoUrl}
                poster={video.thumbnail}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            {video.title}
          </h1>

          {/* Channel Row & Actions bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-[#2d2d2d] pb-4 flex-wrap">
            
            {/* Channel info left */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to={`/channel/${video.channel?._id}`} className="cursor-pointer shrink-0">
                <img
                  src={video.channel?.avatar || 'https://via.placeholder.com/150'}
                  alt={video.channel?.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#2d2d2d] hover:opacity-85 transition"
                />
              </Link>
              <div className="flex flex-col">
                <Link
                  to={`/channel/${video.channel?._id}`}
                  className="font-bold text-white hover:text-purple-400 transition cursor-pointer text-base leading-snug"
                >
                  {video.channel?.name}
                </Link>
                <span className="text-xs text-gray-400">
                  {subscribersCount} subscribers
                </span>
              </div>
              
              {userData?._id !== video.channel?.owner && (
                <button
                  onClick={handleSubscribeToggle}
                  className={`ml-3 px-5 py-2.5 rounded-full text-sm font-semibold transition duration-200 cursor-pointer ${
                    isSubscribed
                      ? 'bg-[#272727] text-gray-300 hover:bg-[#3d3d3d]'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>

            {/* Actions right */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Like / Dislike Container */}
              <div className="flex items-center bg-[#272727] rounded-full p-1 border border-gray-800">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 hover:bg-[#3f3f3f] active:scale-95 transition py-1.5 px-4 rounded-l-full text-sm font-medium border-r border-[#3f3f3f]"
                >
                  {likeState === 'like' ? <FaThumbsUp className="text-purple-500" /> : <FaRegThumbsUp />}
                  <span>{likesCount}</span>
                </button>
                <button
                  className="flex items-center gap-2 hover:bg-[#3f3f3f] active:scale-95 transition py-1.5 px-4 rounded-r-full text-sm font-medium"
                >
                  <FaRegThumbsDown />
                </button>
              </div>

              {/* Share */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showCustomAlert('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] active:scale-95 border border-gray-800 transition py-2 px-4 rounded-full text-sm font-medium cursor-pointer"
              >
                <FaShare />
                <span>Share</span>
              </button>

              {/* Save */}
              <button
                onClick={handleSaveToggle}
                disabled={saveLoading}
                className={`flex items-center gap-2 hover:bg-[#3f3f3f] active:scale-95 border border-gray-800 transition py-2 px-4 rounded-full text-sm font-medium cursor-pointer ${
                  isSaved ? "bg-purple-600 text-white" : "bg-[#272727] text-gray-300"
                }`}
              >
                <FaBookmark className={isSaved ? "text-white" : "text-gray-400"} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>

              {/* Playlist */}
              <button
                onClick={handleOpenPlaylistModal}
                className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] active:scale-95 border border-gray-800 transition py-2 px-4 rounded-full text-sm font-medium cursor-pointer"
              >
                <FaList />
                <span>Playlist</span>
              </button>

              {/* Tip Creator */}
              {userData?._id !== video.channel?.owner && (
                <button
                  onClick={() => setIsTipModalOpen(true)}
                  className="flex items-center gap-2 bg-[#1b122e]/60 hover:bg-[#2c1d4a] border border-purple-500/30 text-purple-300 hover:text-white transition py-2 px-4 rounded-full text-sm font-medium cursor-pointer shadow-md shadow-purple-500/5"
                >
                  <FaCoins className="text-purple-400" />
                  <span>Tip</span>
                </button>
              )}

            </div>

          </div>

          {/* Description Container */}
          <div
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="bg-[#1c1c1c] border border-gray-900 rounded-2xl p-4 hover:bg-[#252525] transition duration-200 cursor-pointer space-y-2 text-sm text-gray-300"
          >
            <div className="flex gap-3 font-semibold text-white">
              <span>{video.views || 0} views</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            
            <p className={`whitespace-pre-line leading-relaxed ${!isDescExpanded ? 'line-clamp-2' : ''}`}>
              {video.description || 'No description provided.'}
            </p>

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {video.tags.map((tag, idx) => (
                  <span key={tag + idx} className="text-purple-400 font-medium hover:underline text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-1 text-xs text-purple-400 font-semibold">
              {isDescExpanded ? 'Show less' : 'Show more'}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6 pt-4">
            
            {/* Header */}
            <div className="flex items-center gap-6">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {comments.length} Comments
              </h2>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddComment} className="flex gap-3 items-start">
              {userData?.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt={userData.userName}
                  className="w-10 h-10 rounded-full object-cover border border-[#2d2d2d]"
                />
              ) : (
                <div className="text-gray-500 bg-[#272727] p-2.5 rounded-full border border-gray-800">
                  <FaUserCircle size={20} />
                </div>
              )}
              
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  className="w-full bg-transparent border-b border-gray-700 py-2 text-sm text-white focus:outline-none focus:border-white transition"
                />

                {inputFocused && (
                  <div className="flex justify-end gap-3 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setNewComment('');
                        setInputFocused(false);
                      }}
                      className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white text-sm font-semibold rounded-full shadow transition cursor-pointer"
                    >
                      {commentLoading ? <ClipLoader color="white" size={14} /> : 'Comment'}
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comments List Feed */}
            {commentsFetching ? (
              <div className="flex justify-center py-6">
                <ClipLoader color="#9333ea" size={24} />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-5 pt-2">
                {[...comments].reverse().map((comment) => (
                  <div key={comment._id} className="flex gap-3 group items-start">
                    
                    {/* User Avatar */}
                    <img
                      src={comment.author?.photoUrl || 'https://via.placeholder.com/150'}
                      alt={comment.author?.userName}
                      className="w-10 h-10 rounded-full object-cover border border-[#2d2d2d]"
                    />

                    {/* Comment Body */}
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-white truncate max-w-37.5">
                          {comment.author?.userName || 'Anonymous'}
                        </span>
                        <span className="text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed wrap-break">
                        {comment.message}
                      </p>
                    </div>

                    {/* Delete Action Button */}
                    {userData && comment.author?._id === userData._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1.5 rounded-full hover:bg-red-500/10 cursor-pointer self-center"
                        title="Delete Comment"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-6">No comments yet. Be the first to share your thoughts!</p>
            )}

          </div>

        </div>

        {/* Right Side: Sidebar recommendations (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight px-1">Up next</h2>
          
          <div className="space-y-4">
            {relatedVideos.length > 0 ? (
              relatedVideos.map((item) => (
                <Link
                  to={`/watch/${item._id}`}
                  key={item._id}
                  className="flex gap-3 group bg-transparent hover:bg-[#1a1a1a] rounded-xl p-1.5 transition duration-200"
                >
                  {/* Thumbnail */}
                  <div className="w-40 aspect-video rounded-lg overflow-hidden bg-black shrink-0 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col justify-start space-y-1 overflow-hidden">
                    <h3 className="text-sm font-semibold text-white group-hover:text-purple-400 transition leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {item.channel?.name || 'Unknown Channel'}
                    </p>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <span>{item.views || 0} views</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-6">No related videos available.</p>
            )}
          </div>

        </div>

      </div>

      {/* Save to Playlist Modal */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#181818]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Save video to...</h3>
              <button
                onClick={() => setIsPlaylistModalOpen(false)}
                className="text-gray-400 hover:text-white transition cursor-pointer text-xl font-bold font-sans"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-75 overflow-y-auto">
              {playlistsLoading ? (
                <div className="flex justify-center py-6">
                  <ClipLoader color="#a855f7" size={24} />
                </div>
              ) : userPlaylists.length > 0 ? (
                <div className="space-y-3">
                  {userPlaylists.map((pl) => {
                    const hasVideo = pl.videos?.includes(videoId);
                    return (
                      <label
                        key={pl._id}
                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer select-none group"
                      >
                        <input
                          type="checkbox"
                          checked={hasVideo}
                          onChange={() => handleToggleVideoPlaylist(pl)}
                          className="w-4 h-4 rounded border-gray-700 bg-[#1a1a1a] text-purple-600 focus:ring-purple-500 focus:ring-offset-[#121212]"
                        />
                        <span className="font-medium group-hover:underline">{pl.title}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm text-gray-500 font-sans">You don't have any playlists yet.</p>
                  <Link
                    to="/createplaylist"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md"
                  >
                    + Create Playlist
                  </Link>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-gray-800 flex justify-end bg-[#181818]">
              <button
                onClick={() => setIsPlaylistModalOpen(false)}
                className="bg-[#272727] hover:bg-[#383838] border border-gray-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Tip Creator Modal */}
      {isTipModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-purple-500/25 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -z-10" />
            
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#181818]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FaCoins className="text-purple-400" />
                <span>Support Creator</span>
              </h3>
              <button
                onClick={() => {
                  setIsTipModalOpen(false);
                  setTipAmount("");
                }}
                className="text-gray-400 hover:text-white transition cursor-pointer text-xl font-bold font-sans"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleTipCreator} className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">
                  Send a crypto tip to <span className="text-purple-400 font-bold">{video.channel?.name}</span> to support their content.
                </p>
                <div className="text-[11px] text-gray-500">
                  Your Balance: <span className="text-gray-300 font-semibold">{userData?.rewardsBalance?.toFixed(1) || 0.0} PTC</span>
                </div>
              </div>

              {/* Presets */}
              <div className="flex gap-2">
                {[2, 5, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTipAmount(val.toString())}
                    className="flex-1 bg-[#1a1a1a] hover:bg-purple-950/30 border border-gray-800 hover:border-purple-500/40 text-gray-300 hover:text-purple-300 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {val} PTC
                  </button>
                ))}
              </div>

              {/* Amount Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Tip Amount (PTC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="Enter PTC amount"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="w-full bg-[#161616] border border-gray-800 focus:border-purple-500/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition pr-12 font-semibold"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400">
                    PTC
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsTipModalOpen(false);
                    setTipAmount("");
                  }}
                  className="bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tipLoading || !tipAmount}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  {tipLoading ? <ClipLoader color="#ffffff" size={12} /> : null}
                  {tipLoading ? "Tipping..." : "Send Tip"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchVideo;
