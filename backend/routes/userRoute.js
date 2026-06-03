import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { createChannel, getCurrentUser } from "../controllers/userController.js"
import upload from "../middlewares/multer.js"


const userRouter = express.Router()

userRouter.get('/getuser', isAuth,getCurrentUser)
userRouter.post("/createchannel", isAuth, upload.fields([
    {name : "avatar", maxCount: 1},
    {name: "banner", maxCount:1}
]), createChannel)

export default userRouter