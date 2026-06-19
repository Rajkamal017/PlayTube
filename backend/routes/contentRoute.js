import express from 'express'
import { createVideo, getAllVideos, getVideoById, addComment, getComments, deleteComment, toggleLikeVideo, searchVideos, incrementViewCount, getLikedVideos, deleteVideo, updateVideo } from '../controllers/video.controller.js'
import { createShort, getAllShorts } from '../controllers/short.controller.js'
import isAuth from '../middlewares/isAuth.js'
import upload from '../middlewares/multer.js'


const contentRouter = express.Router()

// Video Create/Retrieve
contentRouter.post("/create-video", isAuth, upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), createVideo)

// Videos Retrieve
contentRouter.get("/get-all-videos", getAllVideos)
contentRouter.get("/video/:videoId", getVideoById)
contentRouter.get("/search", searchVideos)
contentRouter.post("/video/:videoId/view", incrementViewCount)
contentRouter.get("/liked-videos", isAuth, getLikedVideos)

// Video Update/Delete
contentRouter.delete("/video/:videoId", isAuth, deleteVideo)
contentRouter.put("/video/:videoId", isAuth, upload.single("thumbnail"), updateVideo)

// Comments Routes
contentRouter.post("/video/:videoId/comment", isAuth, addComment)
contentRouter.get("/video/:videoId/comments", getComments)
contentRouter.delete("/video/:videoId/comment/:commentId", isAuth, deleteComment)

// Like/Dislike Routes
contentRouter.post("/video/:videoId/like", isAuth, toggleLikeVideo)


// Shorts Create/Retrieve
contentRouter.post("/create-short", isAuth, upload.single("shortUrl"), createShort)
contentRouter.get("/get-all-shorts", getAllShorts)

export default contentRouter