import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import Video from "../models/video.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import Comment from "../models/comment.model.js";
import mongoose from "mongoose";


const addComment=asyncHandler(async(req,res)=>{

                try{

                   const { videoId } = req.params;
                   const { content } = req.body;

                   
                 if (!content?.trim() || !mongoose.Types.ObjectId.isValid(videoId)) {
                            throw new ApiError(400, "Valid videoId and content are required");
                 }

                 const video = await Video.findById(videoId);
                 if (!video) throw new ApiError(404, "Video not found");
                
                 const commentData= await Comment.create({
                                           content,
                                           video:videoId,
                                           owner:req.user._id,
                                        })

                    console.log("Comment Data:",commentData)

                 res.status(200)
                    .json(new ApiResponse(200,commentData,"Comment posted Successfully"))

                }catch(error)
                {
                    console.log("Comments error:",error)
                    res.status(500)
                    .json(new ApiError(500,"Something Went wrong while user add comments"))
                }
})

const getVideoComment=asyncHandler(async(req,res)=>{
                      try{
                        const {videoId}=req.params;
                        const page= parseInt(req.query.page) || 1;
                        const limit = parseInt(req.query.limit) || 5;
                        console.log(videoId)
                        if (!mongoose.Types.ObjectId.isValid(videoId)) {
                               throw new ApiError(400, "Valid videoId is required");
                          }

                        
                       const skip=(page-1)*limit;

                        const totalComment= await Comment.countDocuments({video:videoId});
                        const commentData = await Comment.find({ video:new mongoose.Types.ObjectId(videoId) })   // always filter by video
                                                  .select("-video")
                                                  .populate("owner", "username -_id")
                                                  .sort({ createdAt: -1 })
                                                  .skip(skip)
                                                  .limit(limit);


                       console.log("Comment Data:",commentData);

                         const resData={
                                        page,
                                        limit,
                                        totalComment,
                                        totalPages:Math.ceil(totalComment/limit),
                                        comment:commentData,
                                        
                         }
                      


                        res.status(200)
                           .json(new ApiResponse(200,resData,"Comment fetched successfully"))

                      }catch(error)
                      {
                        console.log("Error while fetching Video Comment:",error);
                         res.status(500)
                            .json(new ApiError(500,"Something went wrong"))
                      }
})

const updateComment=asyncHandler(async(req,res)=>{
                 try{
                    const {commentId}= req.params;
                    const {content}= req.body;

                    if(! commentId ) throw new ApiError(400,"Comment id is required")

                    if( ! content || ! content?.trim()==="") throw new ApiError(400,"Can not update Blank Content")
                        
                    const commentData= await Comment.findById(commentId)
                                             .populate("video","videoFile title -_id")
                                             .populate("owner","username fullname -_id")
                                             

                    if(! commentData)
                    {
                        throw new ApiError(400,"Invalid Comment Id")
                    }
                    commentData.content=content;

                    res.status(200)
                       .json(new ApiResponse(200,commentData,"Comment updated by User Successfully"))


                 }catch(error)
                 {
                    res.status(500)
                        console.log(error)
                       .json(500,"Something went wrong while updating comment content",error);
                 }
                    
})

const deleteContent=asyncHandler(async(req,res)=>{
    try{

        const {commentId}=req.params;
        
        
        if(! commentId ||  !mongoose.Types.ObjectId.isValid(commentId)) throw new ApiError(500,"Content Id is not valid")

        const comment=await Comment.findByIdAndDelete(commentId)
        if(! comment) throw new ApiError(400,"Comment does not exists")
            
        res.status(200)
           .json(new ApiResponse(200,comment,"Comment Deleted Successfully"))
    }catch(error)
    {
        console.log(error)
        res.status(500)
           .json(new ApiError(500,"Something went wrong while deleting comment",error))
    }
})
export{
          addComment,
          getVideoComment,
          updateComment,
          deleteContent,

    
}