import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/userModel.js"
import Channel from "../models/channelModel.js"
import Video from "../models/videoModel.js"

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({
            message: `getCurrentUser error ${error}`
        })
    }
}

export const createChannel = async (req, res) => {
    try {
        const { name, description, category } = req.body
        const userId = req.userId
        const existingChannel = await Channel.findOne({ owner: userId })
        if (existingChannel) {
            return res.status(400).json({ message: "User already have a channel" })
        }
        const nameExists = await Channel.findOne({ name })
        if (nameExists) {
            return res.status(400).json({ message: "Channel name already taken" })
        }
        let avatar
        let banner

        if (req.files?.avatar) {
            avatar = await uploadOnCloudinary(req.files.avatar[0].path)
        }
        if (req.files?.banner) {
            banner = await uploadOnCloudinary(req.files.banner[0].path)
        }

        const channel = await Channel.create({
            name,
            description,
            category,
            avatar,
            banner,
            owner: userId
        })

        await User.findByIdAndUpdate(userId, {
            channel: channel._id,
            userName: name,
            photoUrl: avatar
        })

        return res.status(201).json(channel)

    } catch (error) {
        return res.status(500).json({ message: `Create Channel error ${error}` })
    }
}

export const updateChannel = async (req, res) => {
    try {
        const { name, description, category } = req.body
        const userId = req.userId
        const channel = await Channel.findOne({ owner: userId })
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }
        if (name && name !== channel.name) {
            const nameExists = await Channel.findOne({ name })
            if (nameExists) {
                return res.status(400).json({ message: "Channel name already taken" })
            }
            channel.name = name
        }
        if (description !== undefined) {
            channel.description = description
        }
        if (category !== undefined) {
            channel.category = category
        }

        if (req.files?.avatar) {
            const avatar = await uploadOnCloudinary(req.files.avatar[0].path)
            channel.avatar = avatar
        }
        if (req.files?.banner) {
            const banner = await uploadOnCloudinary(req.files.banner[0].path)
            channel.banner = banner
        }

        const updatedChannel = await channel.save()

        await User.findByIdAndUpdate(userId, {
            userName: name || undefined,
            photoUrl: channel.avatar || undefined
        },{new:true})

        return res.status(200).json(updatedChannel)


    } catch (error) {
        return res.status(500).json({ message: `Update Channel error ${error}` })
    }
}

export const getChannelData = async (req, res) => {

    try {
        const userId = req.userId
        const channel = await Channel.findOne({ owner: userId })
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }
        return res.status(200).json(channel)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get channel data: ${error}` })
    }
}

export const toggleSubscribeChannel = async (req, res) => {
    try {
        const { channelId } = req.params
        const userId = req.userId

        const channel = await Channel.findById(channelId)
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        if (channel.owner.toString() === userId) {
            return res.status(400).json({ message: "You cannot subscribe to your own channel" })
        }

        const isSubscribed = channel.subscribers.includes(userId)
        if (isSubscribed) {
            channel.subscribers.pull(userId)
        } else {
            channel.subscribers.push(userId)
        }

        await channel.save()

        return res.status(200).json({
            message: isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully",
            subscribersCount: channel.subscribers.length,
            isSubscribed: !isSubscribed,
            subscribers: channel.subscribers
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error toggling subscription state" })
    }
}

export const getChannelById = async (req, res) => {
    try {
        const { channelId } = req.params
        const channel = await Channel.findById(channelId).populate({
            path: "videos",
            populate: {
                path: "channel",
                select: "name avatar"
            }
        })

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        return res.status(200).json({
            message: "Channel data fetched successfully",
            channel
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Failed to get channel: ${error}` })
    }
}

export const addToWatchHistory = async (req, res) => {
    try {
        const { videoId } = req.params
        const userId = req.userId

        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        // Remove duplicate to bring it to the front
        await User.findByIdAndUpdate(userId, {
            $pull: { watchHistory: videoId }
        })

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { watchHistory: videoId } },
            { new: true }
        )

        return res.status(200).json({
            message: "Video added to watch history",
            watchHistory: user.watchHistory
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Failed to add to watch history: ${error}` })
    }
}

export const getWatchHistory = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).populate({
            path: "watchHistory",
            populate: {
                path: "channel",
                select: "name avatar"
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const history = [...user.watchHistory].reverse()

        return res.status(200).json({
            message: "Watch history fetched successfully",
            history
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `Failed to fetch watch history: ${error}` })
    }
}