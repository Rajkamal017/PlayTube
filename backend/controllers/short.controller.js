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