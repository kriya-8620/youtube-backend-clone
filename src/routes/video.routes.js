import {Router} from "express";

import { 
    getAllVideos,
    getVideoById,
     publishAvideo,
     updateVideoById,

} from "../controllers/video.controller.js";

const router=Router();

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/upload-video").post(verifyJWT,
    upload.fields([
        {
            name:"video",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    publishAvideo)

router.route("/get-video").get(verifyJWT,getVideoById)
router.route("/update-video/:videoId").patch(verifyJWT,
    upload.fields([
        {
            name:"video",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    updateVideoById)

router.route("/get-AllVideos").get(verifyJWT,getAllVideos)

export default router;