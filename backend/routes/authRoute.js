import express from "express"
import upload from "../middlewares/multer.js"
import { googleAuth, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controller.js"

const authRouter = express.Router()


authRouter.post("/signup", upload.single("photoUrl"),signUp)
authRouter.post("/signin", signIn)
authRouter.get("/signout", signOut)
authRouter.post("/googleauth", upload.single("photoUrl"), googleAuth)
authRouter.post("/sendotp", sendOtp)
authRouter.post("/verifyotp", verifyOtp)
authRouter.post("/resetpassword", resetPassword)

export default authRouter