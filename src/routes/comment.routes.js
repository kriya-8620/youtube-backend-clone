import {Router} from "express";



const router=Router();


import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteContent, getVideoComment, updateComment } from "../controllers/comment.controller.js";

router.use(verifyJWT)

router.route("/:videoId").post(addComment)
router.route("/:videoId").get(getVideoComment)
router.route("/c/:commentId").patch(updateComment)
                             .delete(deleteContent)




export default router;