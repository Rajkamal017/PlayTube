import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaVideo,
  FaCloudUploadAlt,
  FaTimes,
  FaImage,
  FaTags,
  FaInfoCircle,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";
import { useDispatch } from "react-redux";
import { setAllVideosData } from "../../Redux/contentSlice";

const CreateVideo = () => {
  const { channelData, userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { allVideosData} = useSelector((state) => state.content);
  const dispatch = useDispatch();

  // Form states
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // Drag and drop states
  const [videoDragActive, setVideoDragActive] = useState(false);
  const [thumbnailDragActive, setThumbnailDragActive] = useState(false);

  // Loading and progress states
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // File input refs
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Handle video selection
  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      } else {
        showCustomAlert("Please select a valid video file.");
      }
    }
  };

  // Handle thumbnail selection
  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
      } else {
        showCustomAlert("Please select a valid image file.");
      }
    }
  };

  // Video Drag events
  const handleVideoDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setVideoDragActive(true);
    } else if (e.type === "dragleave") {
      setVideoDragActive(false);
    }
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      } else {
        showCustomAlert("Please select a valid video file.");
      }
    }
  };

  // Thumbnail Drag events
  const handleThumbnailDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setThumbnailDragActive(true);
    } else if (e.type === "dragleave") {
      setThumbnailDragActive(false);
    }
  };

  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setThumbnailDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
      } else {
        showCustomAlert("Please select a valid image file.");
      }
    }
  };

  // Handle tag creation
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const cleanTag = tagInput.trim().replace(/,/g, "");
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit video upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      showCustomAlert("Please upload a video file.");
      return;
    }
    if (!thumbnailFile) {
      showCustomAlert("Please upload a thumbnail image.");
      return;
    }
    if (!title.trim()) {
      showCustomAlert("Please enter a video title.");
      return;
    }
    if (!channelData?._id) {
      showCustomAlert("You need a channel to upload videos.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("tags", JSON.stringify(tags));
    formData.append("channelId", channelData._id);

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(
        `${serverUrl}/api/content/create-video`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      console.log("Upload completed successfully! Response:", response.data);
      setLoading(false);
      showCustomAlert(response.data.message || "Video uploaded successfully!");
      navigate("/viewchannel");
      dispatch(setAllVideosData([response.data.video]));
      const updatechannel= {
        ...channelData ,videos : [...(channelData.videos || []), response.data]
      }
    } catch (error) {
      setLoading(false);
      setUploadProgress(0);
      console.error(
        "Upload failed. Error:",
        error.response?.data || error.message,
      );
      const errorMsg =
        error.response?.data?.message ||
        "Error occurred while uploading the video.";
      showCustomAlert(errorMsg);
    }
  };

  // Render Channel Alert if user does not have a channel
  if (!channelData) {
    return (
      <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
        <div className="bg-[#1f1f1f] border border-red-900/40 p-8 rounded-2xl w-full max-w-md shadow-2xl text-center space-y-6">
          <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-red-500">
            <FaInfoCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Channel Required
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              You must create a channel before you can upload videos to
              PlayTube. Setting up a channel only takes a minute!
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate("/createchannel")}
              className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 transition duration-200 py-3 rounded-xl font-semibold text-white shadow-lg cursor-pointer"
            >
              Create Channel Now
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white transition duration-200 py-3 rounded-xl font-medium cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="border-b border-[#2d2d2d] pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Upload Video
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Publish high-quality video content to your channel:{" "}
            <span className="text-purple-400 font-semibold">
              {channelData?.name}
            </span>
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column - Media upload (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Video Upload Area */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">
                Video File
              </label>

              <div
                onDragEnter={handleVideoDrag}
                onDragOver={handleVideoDrag}
                onDragLeave={handleVideoDrag}
                onDrop={handleVideoDrop}
                onClick={() => videoInputRef.current.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition duration-300 group h-64 overflow-hidden ${
                  videoDragActive
                    ? "border-purple-500 bg-purple-500/10"
                    : videoFile
                      ? "border-emerald-600 bg-emerald-950/10"
                      : "border-gray-700 bg-[#161616] hover:border-purple-500/50 hover:bg-[#1a1a1a]"
                }`}
              >
                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={handleVideoChange}
                />

                {videoFile ? (
                  <div className="text-center space-y-4 w-full px-4">
                    <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-full w-14 h-14 mx-auto flex items-center justify-center">
                      <FaVideo size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-emerald-400 truncate max-w-full">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                      }}
                      className="absolute top-3 right-3 bg-[#2a2a2a] hover:bg-red-500/20 text-gray-400 hover:text-red-400 p-2 rounded-full transition"
                    >
                      <FaTimes size={12} />
                    </button>
                    <span className="inline-block text-xs bg-[#252525] px-3 py-1 rounded-full text-gray-300 font-medium group-hover:bg-[#323232] transition">
                      Change Video
                    </span>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="text-gray-500 group-hover:text-purple-400 transition transform group-hover:-translate-y-1 duration-300">
                      <FaCloudUploadAlt size={48} className="mx-auto" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Drag and drop your video file here
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <span className="inline-block text-xs bg-[#252525] text-purple-400 px-4 py-1.5 rounded-full font-semibold border border-purple-500/20 group-hover:border-purple-500/45 transition">
                      Select File
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Upload Area */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">
                Thumbnail
              </label>

              <div
                onDragEnter={handleThumbnailDrag}
                onDragOver={handleThumbnailDrag}
                onDragLeave={handleThumbnailDrag}
                onDrop={handleThumbnailDrop}
                onClick={() => thumbnailInputRef.current.click()}
                className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition duration-300 group h-48 overflow-hidden ${
                  thumbnailDragActive
                    ? "border-purple-500 bg-purple-500/10"
                    : thumbnailFile
                      ? "border-emerald-600"
                      : "border-gray-700 bg-[#161616] hover:border-purple-500/50 hover:bg-[#1a1a1a]"
                }`}
              >
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />

                {thumbnailFile ? (
                  <div className="w-full h-full relative group/thumb">
                    <img
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition duration-200 rounded-xl">
                      <span className="text-xs bg-purple-600 px-3 py-1.5 rounded-full font-semibold">
                        Change Image
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnailFile(null);
                      }}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-red-500/80 text-white p-1.5 rounded-full transition z-10"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="text-gray-500 group-hover:text-purple-400 transition">
                      <FaImage size={32} className="mx-auto" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-300">
                        Drag and drop your thumbnail image here
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        High resolution 16:9 images recommended
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Text Details & Metadata (Span 7) */}
          <div className="lg:col-span-7 space-y-6 bg-[#161616] border border-[#262626] p-6 sm:p-8 rounded-2xl shadow-xl">
            {/* Title Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="title-input"
                  className="text-sm font-semibold text-gray-300"
                >
                  Title (required)
                </label>
                <span
                  className={`text-xs ${title.length > 90 ? "text-amber-400" : "text-gray-500"}`}
                >
                  {title.length} / 100
                </span>
              </div>
              <input
                id="title-input"
                type="text"
                maxLength={100}
                placeholder="Catchy title for your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0f0f0f] border border-gray-800 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition placeholder-gray-600 text-sm"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="desc-textarea"
                  className="text-sm font-semibold text-gray-300"
                >
                  Description
                </label>
                <span
                  className={`text-xs ${description.length > 4800 ? "text-amber-400" : "text-gray-500"}`}
                >
                  {description.length} / 5000
                </span>
              </div>
              <textarea
                id="desc-textarea"
                maxLength={5000}
                rows={5}
                placeholder="Tell your viewers about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0f0f0f] border border-gray-800 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition placeholder-gray-600 text-sm resize-none"
              />
            </div>

            {/* Tags Chip Input */}
            <div className="space-y-2">
              <label
                htmlFor="tags-input"
                className="text-sm font-semibold text-gray-300 flex items-center gap-1.5"
              >
                <FaTags size={14} className="text-gray-400" />
                Tags
              </label>

              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, idx) => (
                  <span
                    key={tag + idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-950/40 text-purple-300 border border-purple-800/40 rounded-full text-xs font-medium animate-fade-in"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="text-purple-400 hover:text-purple-200 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  id="tags-input"
                  type="text"
                  placeholder="Add a tag (press Enter or Comma)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 p-3.5 rounded-xl bg-[#0f0f0f] border border-gray-800 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition placeholder-gray-600 text-sm"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-[#212121] hover:bg-[#2b2b2b] text-gray-300 hover:text-white px-5 rounded-xl text-sm font-semibold border border-gray-800 transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Upload Progress Section */}
            {loading && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Uploading files...</span>
                  <span className="font-semibold text-purple-400">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-[#0f0f0f] h-2 rounded-full overflow-hidden border border-gray-800">
                  <div
                    className="bg-linear-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-[#262626]">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition duration-300 py-3.5 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <ClipLoader color="white" size={18} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Publish Video</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/create")}
                disabled={loading}
                className="px-6 bg-[#212121] hover:bg-[#2b2b2b] text-gray-300 hover:text-white transition py-3.5 rounded-xl font-semibold border border-gray-800 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVideo;
