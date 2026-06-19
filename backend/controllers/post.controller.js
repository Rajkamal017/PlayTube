import Post from "../models/postModel.js";
import Channel from "../models/channelModel.js";
import uploadOnCloudinary, { deleteFromCloudinary } from "../config/cloudinary.js";

export const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.userId;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const channel = await Channel.findOne({ owner: userId });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found. Please create a channel first." });
        }

        let imageUrl = "";
        if (req.file) {
            const resultUrl = await uploadOnCloudinary(req.file.path);
            if (resultUrl) {
                imageUrl = resultUrl;
            }
        }

        const newPost = await Post.create({
            channel: channel._id,
            content,
            image: imageUrl,
            likes: []
        });

        await Channel.findByIdAndUpdate(channel._id, {
            $push: { communityPost: newPost._id }
        });

        return res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Error occurred while creating post" });
    }
};

export const getPosts = async (req, res) => {
    try {
        const { channelId } = req.params;

        const posts = await Post.find({ channel: channelId })
            .populate("channel")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Error occurred while fetching posts" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const channel = await Channel.findOne({ owner: userId });
        if (!channel || post.channel.toString() !== channel._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        // Delete image from Cloudinary if it exists
        if (post.image) {
            await deleteFromCloudinary(post.image, "image");
        }

        await Channel.findByIdAndUpdate(channel._id, {
            $pull: { communityPost: postId }
        });

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: "Error occurred while deleting post" });
    }
};

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            message: isLiked ? "Post unliked successfully" : "Post liked successfully",
            likesCount: post.likes.length,
            isLiked: !isLiked,
            likes: post.likes
        });
    } catch (error) {
        console.error("Error toggling like on post:", error);
        return res.status(500).json({ message: "Error occurred while liking post" });
    }
};
