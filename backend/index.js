import { config } from "dotenv"
config()
import express from "express"
import connectDb from "./config/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import contentRouter from "./routes/contentRoute.js"
import playlistRouter from "./routes/playlistRoute.js"

const port = process.env.PORT || 8000

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/content", contentRouter)
app.use("/api/playlist", playlistRouter)

app.listen(port, () => {
    connectDb()
    console.log(`server started on port ${port}`)
})