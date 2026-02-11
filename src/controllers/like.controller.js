import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";
import Like from "../models/like.model.js";

import { toggleLike } from "../helper/toggle.js";

const toggleCommentLike=asyncHandler(async(req,res)=>{

          try{
                const {commentId}=req.params;
                        const userId=req.user._id;
                       

                         const result=await toggleLike({
                                      filter:{comment:commentId},
                                      userId
                         })
                        console.log("result:",result)
                         return res.status(200)
                                   .json(new ApiResponse(200,result,"Like updated successfully"))
          }catch(error)
          {
            return res.status(500)
                      .json(new ApiError(500,"Something went wrong while updating Like",error))
          }
                        

})
const togglePostLike=asyncHandler(async(req,res)=>{

          try{
                const {postId}=req.params;
                        const userId=req.user._id;
                       

                         const result=await toggleLike({
                                      filter:{post:postId},
                                      userId
                         })
                        console.log("result:",result)
                         return res.status(200)
                                   .json(new ApiResponse(200,result,"Like updated successfully"))
          }catch(error)
          {
            return res.status(500)
                      .json(new ApiError(500,"Something went wrong while updating Like",error))
          }
                        

})

const toggleVideoLike=asyncHandler(async(req,res)=>{

          try{
                const {videoId}=req.params;
                        const userId=req.user._id;
                       
                          console.log("Video Id:",videoId)
                         const result=await toggleLike({
                                      filter:{video:videoId},
                                      userId
                         })
                        console.log("result:",result)
                         return res.status(200)
                                   .json(new ApiResponse(200,result,"Like updated successfully"))
          }catch(error)
          {
            return res.status(500)
                      .json(new ApiError(500,"Something went wrong while updating Like",error))
          }
                        

})

const getLikedVideos=asyncHandler(async(req,res)=>{
    try{
       const page = parseInt(req.query.page) || 1;
                   const limit= parseInt(req.query.limit) || 5;
                   const userId = req.user._id;

                   const totalLikedVideos=await Like.countDocuments({
                                          likedBy: userId,
                                          video: { $exists: true }
                   });
                   const skip=(page-1)*limit;

                   const liked=await Like.find({
                                        likedBy: userId,
                                        video: { $exists: true }
                   })
                         
                         .populate("video","videoFile title -_id")
                         .populate("likedBy", "username -_id")
                         .sort({createdAt:-1})
                         .skip(skip)
                         .limit(limit)

                  console.log(liked);
                  const resData={
                                page,
                                limit,
                                totalLikedVideos,
                                totalPages:Math.ceil(totalLikedVideos/limit),
                                liked,
                                }
                  res.status(200)
                     .json(new ApiResponse(200,resData,"Video Fetched Successfully"))
    }catch(error)
    {
        return res.status(500)
                  .json(new ApiError(500,"Something Went Wrong while fetching the liked videos",error))
    }
})

export {
    toggleCommentLike,
    togglePostLike,
    toggleVideoLike,
    getLikedVideos,
}