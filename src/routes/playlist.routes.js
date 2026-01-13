import {Router} from "express";



const router=Router();


import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getUserPlaylist, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import {validateObjectId,requireBodyFields} from "../middlewares/validator.js";

router.use(verifyJWT)

router.route("/create-playlist").post(createPlaylist)
router.route("/:playlistId/videos/:videoId")
.post(validateObjectId("playlistId","videoId"),
addVideoToPlaylist,)

router.route("/:playlistId/videos/:videoId")
.delete(validateObjectId("playlistId","videoId"),
removeVideoFromPlaylist)

router.route("/:playlistId")
      .delete(validateObjectId("playlistId"),
       deletePlaylist)

router.route("/:playlistId")
      .patch(validateObjectId("playlistId"),
       updatePlaylist
    )
router.route("/getuserplaylist/:userId")
      .get(validateObjectId("userId"),
      getUserPlaylist
    )

export default router;