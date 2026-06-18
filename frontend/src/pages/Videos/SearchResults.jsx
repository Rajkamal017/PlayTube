import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { FaSearch, FaRegFolderOpen } from 'react-icons/fa';
import { serverUrl } from '../../config';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/content/search?q=${encodeURIComponent(query)}`, {
          withCredentials: true,
        });
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <ClipLoader color="#9333ea" size={50} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Title / Info */}
        <div className="border-b border-[#2d2d2d] pb-4 flex items-center gap-3">
          <FaSearch className="text-gray-400 text-lg" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Search results for: <span className="text-purple-400 font-semibold">"{query}"</span>
          </h1>
        </div>

        {/* Results Feed */}
        {videos.length > 0 ? (
          <div className="space-y-6">
            {videos.map((video) => (
              <Link
                to={`/watch/${video._id}`}
                key={video._id}
                className="flex flex-col sm:flex-row gap-5 group bg-transparent hover:bg-[#161616] p-3 rounded-2xl border border-transparent hover:border-gray-800/40 transition duration-300 cursor-pointer"
              >
                {/* Video Thumbnail (Left / Top on Mobile) */}
                <div className="w-full sm:w-72 md:w-80 aspect-video rounded-xl overflow-hidden bg-black flex-shrink-0 relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300" />
                </div>

                {/* Video Details (Right / Bottom on Mobile) */}
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
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (video.channel?._id) {
                        navigate(`/channel/${video.channel._id}`);
                      }
                    }}
                    className="flex items-center gap-2 pt-1 cursor-pointer hover:opacity-80 transition"
                  >
                    <img
                      src={video.channel?.avatar || 'https://via.placeholder.com/150'}
                      alt={video.channel?.name}
                      className="w-6 h-6 rounded-full object-cover border border-gray-800"
                    />
                    <span className="text-sm font-semibold text-gray-300 hover:text-white transition">
                      {video.channel?.name || 'Unknown Channel'}
                    </span>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed max-w-2xl">
                    {video.description || 'No description available.'}
                  </p>

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {video.tags.slice(0, 3).map((tag, idx) => (
                        <span key={tag + idx} className="text-xs text-purple-400 font-medium hover:underline">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-5">
            <div className="bg-[#1c1c1c] text-gray-500 p-6 rounded-full border border-gray-800 animate-pulse">
              <FaRegFolderOpen size={48} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-gray-300">No results found</h2>
              <p className="text-sm text-gray-500 max-w-sm">
                Try different keywords, tags, or check spelling to find what you're looking for.
              </p>
            </div>
            <Link
              to="/"
              className="bg-[#272727] hover:bg-[#323232] px-6 py-2.5 rounded-full text-sm font-semibold border border-gray-800 transition"
            >
              Go Back Home
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchResults;
