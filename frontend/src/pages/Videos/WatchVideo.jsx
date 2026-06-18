import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown, FaShare, FaBookmark, FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../../config';
import { showCustomAlert } from '../../components/CustomeAlert';
import { setAllVideosData } from '../../redux/contentSlice';

const WatchVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allVideosData } = useSelector((state) => state.content);

  // States
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeState, setLikeState] = useState(null); // 'like', 'dislike', or null
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Fetch active video details
  useEffect(() => {
    const fetchVideoDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/content/video/${videoId}`, {
          withCredentials: true,
        });
        setVideo(response.data.video);
      } catch (error) {
        console.error(error);
        showCustomAlert('Failed to load video details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
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

  const handleSubscribeToggle = () => {
    setIsSubscribed(!isSubscribed);
    showCustomAlert(!isSubscribed ? `Subscribed to ${video?.channel?.name}` : `Unsubscribed from ${video?.channel?.name}`);
  };

  const handleLike = () => {
    if (likeState === 'like') {
      setLikeState(null);
    } else {
      setLikeState('like');
    }
  };

  const handleDislike = () => {
    if (likeState === 'dislike') {
      setLikeState(null);
    } else {
      setLikeState('dislike');
    }
  };

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
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Video Player & Details (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Video Player */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800 shadow-2xl">
            <video
              src={video.videoUrl}
              poster={video.thumbnail}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            {video.title}
          </h1>

          {/* Channel Row & Actions bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-[#2d2d2d] pb-4">
            
            {/* Channel info left */}
            <div className="flex items-center gap-3">
              <img
                src={video.channel?.avatar || 'https://via.placeholder.com/150'}
                alt={video.channel?.name}
                className="w-11 h-11 rounded-full object-cover border border-[#2d2d2d]"
              />
              <div className="flex flex-col">
                <span className="font-bold text-white hover:text-purple-400 transition cursor-pointer text-base leading-snug">
                  {video.channel?.name}
                </span>
                <span className="text-xs text-gray-400">
                  {video.channel?.subscribers?.length || 0} subscribers
                </span>
              </div>
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
            </div>

            {/* Actions right */}
            <div className="flex items-center gap-2 overflow-x-auto">
              
              {/* Like / Dislike Container */}
              <div className="flex items-center bg-[#272727] rounded-full p-1 border border-gray-800">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 hover:bg-[#3f3f3f] active:scale-95 transition py-1.5 px-4 rounded-l-full text-sm font-medium border-r border-[#3f3f3f]"
                >
                  {likeState === 'like' ? <FaThumbsUp className="text-purple-500" /> : <FaRegThumbsUp />}
                  <span>{video.likes?.length + (likeState === 'like' ? 1 : 0) || 0}</span>
                </button>
                <button
                  onClick={handleDislike}
                  className="flex items-center gap-2 hover:bg-[#3f3f3f] active:scale-95 transition py-1.5 px-4 rounded-r-full text-sm font-medium"
                >
                  {likeState === 'dislike' ? <FaThumbsDown className="text-purple-500" /> : <FaRegThumbsDown />}
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
                onClick={() => showCustomAlert('Video saved to library')}
                className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] active:scale-95 border border-gray-800 transition py-2 px-4 rounded-full text-sm font-medium cursor-pointer"
              >
                <FaBookmark />
                <span>Save</span>
              </button>

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
                  <div className="w-40 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0 relative">
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
    </div>
  );
};

export default WatchVideo;
