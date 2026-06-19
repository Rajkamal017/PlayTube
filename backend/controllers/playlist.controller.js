import Playlist from "../models/playlistModel.js";
import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";

export const createPlaylist = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.userId;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const channel = await Channel.findOne({ owner: userId });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found. Please create a channel first." });
        }

        const newPlaylist = await Playlist.create({
            title,
            description,
            channel: channel._id,
            videos: []
        });

        await Channel.findByIdAndUpdate(channel._id, {
            $push: { playlists: newPlaylist._id }
        });

        return res.status(201).json({
            message: "Playlist created successfully",
            playlist: newPlaylist
        });
    } catch (error) {
        console.error("Error creating playlist:", error);
        return res.status(500).json({ message: "Error occurred while creating playlist" });
    }
};

export const getPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;

        const playlist = await Playlist.findById(playlistId)
            .populate("channel")
            .populate({
                path: "videos",
                populate: {
                    path: "channel",
                    select: "name avatar"
                }
            });

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        return res.status(200).json({
            message: "Playlist fetched successfully",
            playlist
        });
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return res.status(500).json({ message: "Error occurred while fetching playlist" });
    }
};

export const deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const userId = req.userId;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const channel = await Channel.findOne({ owner: userId });
        if (!channel || playlist.channel.toString() !== channel._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this playlist" });
        }

        await Channel.findByIdAndUpdate(channel._id, {
            $pull: { playlists: playlistId }
        });

        await Playlist.findByIdAndDelete(playlistId);

        return res.status(200).json({
            message: "Playlist deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting playlist:", error);
        return res.status(500).json({ message: "Error occurred while deleting playlist" });
    }
};

export const addVideoToPlaylist = async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;
        const userId = req.userId;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const channel = await Channel.findOne({ owner: userId });
        if (!channel || playlist.channel.toString() !== channel._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to modify this playlist" });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (playlist.videos.includes(videoId)) {
            return res.status(400).json({ message: "Video already exists in this playlist" });
        }

        playlist.videos.push(videoId);
        await playlist.save();

        return res.status(200).json({
            message: "Video added to playlist successfully",
            playlist
        });
    } catch (error) {
        console.error("Error adding video to playlist:", error);
        return res.status(500).json({ message: "Error occurred while adding video to playlist" });
    }
};

export const removeFromPlaylist = async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;
        const userId = req.userId;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const channel = await Channel.findOne({ owner: userId });
        if (!channel || playlist.channel.toString() !== channel._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to modify this playlist" });
        }

        if (!playlist.videos.includes(videoId)) {
            return res.status(400).json({ message: "Video is not in this playlist" });
        }

        playlist.videos.pull(videoId);
        await playlist.save();

        return res.status(200).json({
            message: "Video removed from playlist successfully",
            playlist
        });
    } catch (error) {
        console.error("Error removing video from playlist:", error);
        return res.status(500).json({ message: "Error occurred while removing video from playlist" });
    }
};

export const getUserPlaylists = async (req, res) => {
    try {
        const userId = req.userId;
        const channel = await Channel.findOne({ owner: userId });
        if (!channel) {
            return res.status(200).json({
                message: "No channel found for this user",
                playlists: []
            });
        }

        const playlists = await Playlist.find({ channel: channel._id });

        return res.status(200).json({
            message: "User playlists fetched successfully",
            playlists
        });
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        return res.status(500).json({ message: "Error occurred while fetching user playlists" });
    }
};

