import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlay,
  FaCloudUploadAlt,
  FaTimes,
  FaTags,
  FaInfoCircle,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../config";
import { showCustomAlert } from "../../components/CustomeAlert";

const CreateShorts = () => {
  const { channelData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [shortFile, setShortFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // ye state upload area ko active krne k liye use hoti hain
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  // ye handleFileChange function video ko select krne k liye use hota hain
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setShortFile(file);
      } else {
        showCustomAlert("Please select a valid video file for your Short.");
      }
    }
  };

  // mtlb user jab short video ko upload area k upr drag krta hain to ye function rokta hain or set krta hain drag state ko true
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // This drop function allows users to drag and drop the short video file into the upload area
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setShortFile(file);
      } else {
        showCustomAlert("Please select a valid video file.");
      }
    }
  };

  // Tag inputs
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

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shortFile) {
      showCustomAlert("Please select a video for your Short.");
      return;
    }
    if (!title.trim()) {
      showCustomAlert("Please enter a title for your Short.");
      return;
    }
    if (!channelData?._id) {
      showCustomAlert("You need a channel to create shorts.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("shortUrl", shortFile); // Must be 'shortUrl' to match backend upload.single("shortUrl")
    formData.append("tags", JSON.stringify(tags));
    formData.append("channelId", channelData._id);

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(
        `${serverUrl}/api/content/create-short`,
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

      setLoading(false);
      showCustomAlert(
        response.data.message || "Short video uploaded successfully!",
      );
      navigate("/viewchannel");
    } catch (error) {
      setLoading(false);
      setUploadProgress(0);
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        "Error occurred while uploading Short.";
      showCustomAlert(errorMsg);
    }
  };

  // Render Channel warning alert if user does not have a channel
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
              You must create a channel before you can post short-form video
              content to PlayTube.
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
      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="border-b border-[#2d2d2d] pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Create Short
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Publish vertical videos under 60 seconds. Channel:{" "}
            <span className="text-purple-400 font-semibold">
              {channelData?.name}
            </span>
          </p>
        </div>

        {/* Form Grid */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          {/* Left Panel: 9:16 Video Preview Block */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">
                Short Video (9:16 vertical)
              </label>

              {/* this whole div is the main part of the left panel where we upload the short video */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`relative border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition duration-300 group overflow-hidden w-full aspect-[9/16] max-h-[500px] ${
                  dragActive
                    ? "border-purple-500 bg-purple-500/10"
                    : shortFile
                      ? "border-emerald-600 bg-[#121212]"
                      : "border-gray-700 bg-[#161616] hover:border-purple-500/50 hover:bg-[#1a1a1a]"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                />

                {shortFile ? (
                  <div className="w-full h-full relative group/video">
                    <video
                      src={URL.createObjectURL(shortFile)}
                      className="w-full h-full object-cover"
                      controls={false}
                      muted
                      loop
                      autoPlay
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/video:opacity-100 flex flex-col items-center justify-center transition duration-200">
                      <FaPlay
                        size={28}
                        className="text-purple-400 mb-2 animate-pulse"
                      />
                      <span className="text-xs bg-purple-600 px-3 py-1.5 rounded-full font-semibold">
                        Change Video
                      </span>
                      <p className="text-[10px] text-gray-300 mt-2 truncate max-w-[80%]">
                        {shortFile.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShortFile(null);
                      }}
                      className="absolute top-3 right-3 bg-black/70 hover:bg-red-500/80 text-white p-2 rounded-full transition z-10"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="text-gray-500 group-hover:text-purple-400 transition transform group-hover:-translate-y-1 duration-300">
                      <FaCloudUploadAlt size={48} className="mx-auto" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Drag & Drop vertical video
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        or click to select file
                      </p>
                    </div>
                    <span className="inline-block text-xs bg-[#252525] text-purple-400 px-4 py-1.5 rounded-full font-semibold border border-purple-500/20 group-hover:border-purple-500/45 transition">
                      Select Video
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Fields */}
          <div className="md:col-span-7 space-y-6 bg-[#161616] border border-[#262626] p-6 sm:p-8 rounded-2xl shadow-xl self-start">
            {/* Title */}
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
                placeholder="Give your Short a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0f0f0f] border border-gray-800 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition placeholder-gray-600 text-sm"
              />
            </div>

            {/* Description */}
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
                rows={4}
                placeholder="Add details about your Short..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0f0f0f] border border-gray-800 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition placeholder-gray-600 text-sm resize-none"
              />
            </div>

            {/* Tags */}
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
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-950/40 text-purple-300 border border-purple-800/40 rounded-full text-xs font-medium"
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

            {/* Upload Progress Bar */}
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

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-[#262626]">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition duration-300 py-3.5 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <ClipLoader color="white" size={18} />
                    <span>Uploading Short...</span>
                  </>
                ) : (
                  <span>Publish Short</span>
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

export default CreateShorts;
