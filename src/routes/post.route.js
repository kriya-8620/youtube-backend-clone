import {Router} from "express";



const router=Router();


import { verifyJWT } from "../middlewares/auth.middleware.js";
import {requireBodyFields,validateObjectId} from "../middlewares/validator.js"
import {createPost, deleteUserPost, getUserPost, updateUserPost} from "../controllers/post.controller.js";

router.use(verifyJWT)

router.route("/create-post").post(requireBodyFields("content"),createPost)
router.route("/getUser-post/:userId").get(validateObjectId("userId"),getUserPost)
router.route("/updateUser-post/:postId").patch(validateObjectId("postId"),requireBodyFields("content"),updateUserPost)
router.route("/deleteUser-post/:postId").delete(validateObjectId("postId"),deleteUserPost)

export default router;