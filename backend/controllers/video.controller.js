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