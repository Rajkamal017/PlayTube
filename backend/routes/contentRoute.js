import express from 'express'
import { createVideo, getAllVideos, getVideoById } from '../controllers/video.controller.js'
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


// Shorts Create/Retrieve
contentRouter.post("/create-short", isAuth, upload.single("shortUrl"), createShort)
contentRouter.get("/get-all-shorts", getAllShorts)

export default contentRouter