import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { FaList, FaArrowLeft } from "react-icons/fa";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelData) {
      showCustomAlert("Please create a channel first before creating a playlist!");
      navigate("/createchannel");
      return;
    }
    if (!title.trim()) {
      showCustomAlert("Playlist title is required!");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/playlist/create`,
        { title, description },
        { withCredentials: true }
      );
      showCustomAlert("Playlist created successfully!");
      navigate(`/channel/${channelData._id}`);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to create playlist.";
      showCustomAlert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-6 py-8 mt-10 flex flex-col items-center">
      <div className="w-full max-w-lg space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm cursor-pointer"
        >
          <FaArrowLeft size={12} />
          <span>Back</span>
        </button>

        <header className="border-b border-[#3f3f3f] pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <FaList className="text-purple-500" /> New Playlist
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Create a custom playlist to organize your videos or saved content.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Playlist Title
            </label>
            <input
              type="text"
              placeholder="e.g., My Favorite Tech Talks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#1f1f1f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              placeholder="Give your playlist a description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              className="bg-[#1f1f1f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer mt-4"
          >
            {loading ? <ClipLoader color="#ffffff" size={16} /> : null}
            {loading ? "Creating..." : "Create Playlist"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylist;
