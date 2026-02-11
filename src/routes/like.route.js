import {Router} from "express";



const router=Router();


import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleCommentLike, togglePostLike, toggleVideoLike,getLikedVideos } from "../controllers/like.controller.js";
import { validateObjectId } from "../middlewares/validator.js";

router.use(verifyJWT)

router.route("/comment-toggle/:commentId").post(validateObjectId("commentId"),toggleCommentLike)
router.route("/post-toggle/:postId").post(validateObjectId("postId"),togglePostLike)
router.route("/video-toggle/:videoId").post(validateObjectId("videoId"),toggleVideoLike)
router.route("/get-likedVideos/:userId").get(validateObjectId("userId"),getLikedVideos)



export default router;