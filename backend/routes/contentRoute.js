import express from 'express'
import { createVideo } from '../controllers/video.controller.js'
import { createShort } from '../controllers/short.controller.js'
import isAuth from '../middlewares/isAuth.js'
import upload from '../middlewares/multer.js'


const contentRouter = express.Router()

// Video Create Krne k liye(Private Route)
contentRouter.post("/create-video", isAuth, upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), createVideo)

// Shorts Create Krne k liye(Private Route)
contentRouter.post("/create-short", isAuth, upload.single("shortUrl"), createShort)

export default contentRouter