import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../models/channelModel.js"
import Video from "../models/videoModel.js"



export const createVideo = async (req, res) => {
    try {
        const { title, description, tags, channelId } = req.body

        // Check if all required fields are present
        if (!title || !req.files.video || !req.files.thumbnail || !channelId) {
            return res.status(400).json({
                message: "title, videoUrl, thumbnail, channelId is required"
            })
        }
        // Check if channel is valid
        const channelData = await Channel.findById(channelId)
        if (!channelData) {
            return res.status(400).json({ message: "Channel not found by Id" })
        }

        // Upload video and thumbnail on cloudinary
        const uploadVideo = await uploadOnCloudinary(req.files.video[0].path)
        const uploadThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path)

        if (!uploadVideo || !uploadThumbnail) {
            return res.status(400).json({ message: "Error while uploading" })
        }

        // Parse tags array from string to array
        let parsedTag = []
        if (tags) {
            try {
                parsedTag = JSON.parse(tags)
            } catch (error) {
                parsedTag = []
                console.log(error)
                return res.status(400).json({ message: "Error while parsing tags" })
            }
        }

        // Create Video
        const newVideo = await Video.create({
            title,
            description,
            tags: parsedTag,
            videoUrl: uploadVideo,
            thumbnail: uploadThumbnail,
            channel: channelData._id
        })

        // Add Video Id into channel's video array
        await Channel.findByIdAndUpdate(channelData._id,
            { $push: { videos: newVideo._id } },
            { new: true }
        )

        return res.status(201).json({
            message: "Video created successfully",
            video: newVideo
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error occur while uploading" })
    }
}


export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate("channel")
        return res.status(200).json({
            message: "Videos fetched successfully",
            videos
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occur while fetching videos" })
    }
}


export const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await Video.findById(videoId).populate("channel")

        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        return res.status(200).json({
            message: "Video fetched successfully",
            video
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred while fetching video details" })
    }
}


export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params
        const { message } = req.body

        if (!message) {
            return res.status(400).json({ message: "Comment message is required" })
        }

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        const newComment = {
            author: req.userId,
            message
        }

        video.comments.push(newComment)
        await video.save()

        const updatedVideo = await Video.findById(videoId).populate("comments.author", "userName photoUrl")
        
        return res.status(201).json({
            message: "Comment added successfully",
            comments: updatedVideo.comments
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred while adding comment" })
    }
}

export const getComments = async (req, res) => {
    try {
        const { videoId } = req.params

        const video = await Video.findById(videoId).populate("comments.author", "userName photoUrl")
        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments: video.comments
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred while fetching comments" })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { videoId, commentId } = req.params

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        const comment = video.comments.id(commentId)
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }

        if (comment.author.toString() !== req.userId) {
            return res.status(401).json({ message: "Unauthorized to delete this comment" })
        }

        video.comments.pull(commentId)
        await video.save()

        const updatedVideo = await Video.findById(videoId).populate("comments.author", "userName photoUrl")

        return res.status(200).json({
            message: "Comment deleted successfully",
            comments: updatedVideo.comments
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred while deleting comment" })
    }
}

export const toggleLikeVideo = async (req, res) => {
    try {
        const { videoId } = req.params
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        const isLiked = video.likes.includes(userId)
        if (isLiked) {
            video.likes.pull(userId)
        } else {
            video.likes.push(userId)
            // Remove user from disLikes if they previously disliked
            if (video.disLikes && video.disLikes.includes(userId)) {
                video.disLikes.pull(userId)
            }
        }

        await video.save()
        
        return res.status(200).json({
            message: isLiked ? "Video unliked successfully" : "Video liked successfully",
            likesCount: video.likes.length,
            isLiked: !isLiked,
            likes: video.likes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred while toggling like" })
    }
}

export const searchVideos = async (req, res) => {
    try {
        const { q } = req.query
        if (!q) {
            return res.status(400).json({ message: "Search query is required" })
        }

        const query = {
            $or: [
                { title: { $regex: q, $options: "i" } },
                { tags: { $regex: q, $options: "i" } }
            ]
        }

        const videos = await Video.find(query).populate("channel")
        return res.status(200).json({
            message: "Search completed successfully",
            videos
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred while searching videos" })
    }
}

export const incrementViewCount = async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        )

        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        return res.status(200).json({
            message: "View count incremented successfully",
            views: video.views
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred while incrementing view count" })
    }
}

export const getLikedVideos = async (req, res) => {
    try {
        const userId = req.userId
        const videos = await Video.find({ likes: userId }).populate("channel")

        return res.status(200).json({
            message: "Liked videos fetched successfully",
            videos
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred while fetching liked videos" })
    }
}