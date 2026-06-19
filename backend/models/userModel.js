import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    photoUrl: {
        type: String,
        default: ""
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    },
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    savedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    rewardsBalance: {
        type: Number,
        default: 0
    },
    rewardsHistory: [{
        type: { type: String }, // 'watch', 'tip_sent', 'tip_received'
        amount: { type: Number },
        detail: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    resetOtp: { type: String },
    otpExpires: { type: Date },
    isOtpVerified: { type: Boolean, default: false }

}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)


export default User 