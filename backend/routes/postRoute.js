import express from "express";
import {
    createPost,
    getPosts,
    deletePost,
    likePost
} from "../controllers/post.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const postRouter = express.Router();

postRouter.post("/create", isAuth, upload.single("image"), createPost);
postRouter.get("/channel/:channelId", getPosts);
postRouter.delete("/:postId", isAuth, deletePost);
postRouter.post("/:postId/like", isAuth, likePost);

export default postRouter;
