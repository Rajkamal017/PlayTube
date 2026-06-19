import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { FaPen, FaArrowLeft, FaImage, FaTimes } from "react-icons/fa";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const CreatePost = () => {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelData) {
      showCustomAlert("Please create a channel first to publish community posts!");
      navigate("/createchannel");
      return;
    }
    if (!content.trim()) {
      showCustomAlert("Post content is required!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post(`${serverUrl}/api/post/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      showCustomAlert("Post published successfully!");
      navigate(`/channel/${channelData._id}`);
    } catch (error) {
      console.error("Error creating community post:", error);
      const errorMsg = error.response?.data?.message || "Failed to publish post.";
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
            <FaPen className="text-purple-500" /> New Community Post
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Share updates, photos, or announcements directly with your channel subscribers.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              What's on your mind?
            </label>
            <textarea
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              className="bg-[#1f1f1f] border border-[#3f3f3f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Attachment (Optional Image)
            </label>
            
            {imagePreview ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-800 bg-[#0c0c0c] flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="h-full object-contain" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 text-white p-2 rounded-full transition cursor-pointer"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  id="post-image-input"
                />
                <label
                  htmlFor="post-image-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-800 hover:border-purple-500 bg-[#121212] py-8 rounded-xl cursor-pointer transition"
                >
                  <FaImage size={24} className="text-gray-500 mb-2" />
                  <span className="text-xs font-bold text-gray-400">Select Image to Upload</span>
                  <span className="text-[10px] text-gray-600 mt-1">Supports PNG, JPG, JPEG</span>
                </label>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer mt-4"
          >
            {loading ? <ClipLoader color="#ffffff" size={16} /> : null}
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
