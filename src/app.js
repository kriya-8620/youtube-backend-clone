import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express();


app.use(cors({
  
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(cookieParser());
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));




// Route Import

import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import CommentRouter from "./routes/comment.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import postRouter from "./routes/post.route.js";
import likeRouter from "./routes/like.route.js";

// Routes Declaration

app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/comments",CommentRouter);
app.use("/api/v1/playlists",playlistRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/likes",likeRouter);


export {app};