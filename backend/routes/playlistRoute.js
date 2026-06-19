import express from "express";
import {
    createPlaylist,
    getPlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeFromPlaylist
} from "../controllers/playlist.controller.js";
import isAuth from "../middlewares/isAuth.js";

const playlistRouter = express.Router();

// Playlist CRUD
playlistRouter.post("/create", isAuth, createPlaylist);
playlistRouter.get("/:playlistId", getPlaylist);
playlistRouter.delete("/:playlistId", isAuth, deletePlaylist);

// Video associations
playlistRouter.post("/:playlistId/video/:videoId", isAuth, addVideoToPlaylist);
playlistRouter.delete("/:playlistId/video/:videoId", isAuth, removeFromPlaylist);

export default playlistRouter;
