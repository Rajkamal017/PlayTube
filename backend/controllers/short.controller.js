import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../models/channelModel.js"
import Short from "../models/shortModel.js"



export const createShort = async (req, res) => {

    try {
        const {title,description, tags, channelId} = req.body

        if(!title || !channelId){
            return res.status(400).json({
                message: "title, channelId is required"
            })
        }
        if(!req.file){
            return res.status(400).json({
                message: "Short video file is required"
            })
        }

        // get url of short
        const shortUrl = await uploadOnCloudinary(req.file.path)
        if(!shortUrl){
            return res.status(400).json({message: "error occur while uploading"})
        }

        const channelData = await Channel.findById(channelId)

        if(!channelData){
            return res.status(404).json({message: "channel not found"})
        }

        if(channelData.owner.toString() !== req.userId){
            return res.status(401).json({message: "Unauthorized"})
        }

        // create new short video
        const newShort = await Short.create({
            channel:channelData._id,
            title,
            description,
            shortUrl,
            tags: tags ? JSON.parse(tags):[]
        })

        // add new short to channel
        await Channel.findByIdAndUpdate(channelData._id,{
            $push:{shorts:newShort._id}
        },{ new: true})

        return res.status(201).json({
            message:"Short video created successfully",
            short:newShort
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "error occur while uploading"})
    }
}


export const getAllShorts = async (req, res) => {
    try {
        const shorts = await Short.find().populate("channel")
        return res.status(200).json({
            message: "Shorts fetched successfully",
            shorts
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occur while fetching shorts" })
    }
}

export const getShortById = async (req, res) => {
    try {
        const { shortId } = req.params;
        const short = await Short.findById(shortId).populate("channel");

        if (!short) {
            return res.status(404).json({ message: "Short video not found" });
        }

        return res.status(200).json({
            message: "Short video fetched successfully",
            short
        });
    } catch (error) {
        console.error("Error fetching short details:", error);
        return res.status(500).json({ message: "Error occurred while fetching short video details" });
    }
};

export const toggleLikeShort = async (req, res) => {
    try {
        const { shortId } = req.params;
        const userId = req.userId;

        const short = await Short.findById(shortId);
        if (!short) {
            return res.status(404).json({ message: "Short video not found" });
        }

        const isLiked = short.likes.includes(userId);
        if (isLiked) {
            short.likes.pull(userId);
        } else {
            short.likes.push(userId);
            if (short.disLikes && short.disLikes.includes(userId)) {
                short.disLikes.pull(userId);
            }
        }

        await short.save();
        
        return res.status(200).json({
            message: isLiked ? "Short unliked successfully" : "Short liked successfully",
            likesCount: short.likes.length,
            isLiked: !isLiked,
            likes: short.likes
        });
    } catch (error) {
        console.error("Error toggling like on short:", error);
        return res.status(500).json({ message: "Error occurred while toggling like on short" });
    }
};

export const incrementShortViewCount = async (req, res) => {
    try {
        const { shortId } = req.params;
        const short = await Short.findByIdAndUpdate(
            shortId,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!short) {
            return res.status(404).json({ message: "Short video not found" });
        }

        return res.status(200).json({
            message: "Short view count incremented successfully",
            views: short.views
        });
    } catch (error) {
        console.error("Error incrementing short view:", error);
        return res.status(500).json({ message: "Error occurred while incrementing short view count" });
    }
};