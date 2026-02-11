import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";

import mongoose from "mongoose";


const createPost=asyncHandler(async(req,res)=>{
                 try{
                    const {content} = req.body;
                    console.log("Content Data:",content)
                    
                    const createData = await Post.create(
                        {
                            content,
                            owner:req.user._id
                        }
                    )
               
                   console.log("New User Created:",createData)
                  return res.status(200)
                            .json(new ApiResponse(200,createData,"User's Post created successfully"))

                 }catch(error)
                 {
                    return res.status(500)
                              .json(new ApiError(500,"Something went wrong while creating Post",error))
                 }
})

const getUserPost=asyncHandler(async(req,res)=>{

                try{
                    const {userId}= req.params;

              const postData = await Post.aggregate([
 {
    $match: { owner: new mongoose.Types.ObjectId(userId) }
  },
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner"
    }
  },
  {
    $unwind: "$owner" // flatten owner array into a single object
  },
  {
    $project: {
      _id: 0,          // exclude post _id
      content: 1,      // include post content
      ownerUsername:"$owner.username"
     
    }
  }
]);
                            return res.status(200)
                             .json(new ApiResponse(200,postData,"User Post Data fetched successfully"))
                    
                }catch(error)
                {
                    return res.status(500)
                              .json(500,"Something went wrong while fetching User Post",error)
                }
})

const updateUserPost=asyncHandler(async(req,res)=>{

                     try{
                      
                        const {postId}=req.params;
                        const {content}=req.body;

                        const updatedContent=await Post.findByIdAndUpdate(postId,{$set:{content}})
                        console.log("updated Content:",updatedContent)

                      return res.status(200)
                                 .json(new ApiResponse(200,updatedContent,"User Post Updated Successfully"))  
                     }catch(error)
                     {
                             res.status(500)
                                .json(new ApiResponse(500,"Something Went wrong while Updating User Post",error))
                     }
})
const deleteUserPost=asyncHandler(async(req,res)=>{
                    try{
                     const deletedData=await Post.findByIdAndDelete(req.params.postId)
                     console.log("Deleted Data:",deletedData)

                        res.status(200)
                           .json(new ApiResponse(200,deletedData,"User Data Deleted Successfully"))                           

                    }catch(error)
                    {
                        res.status(500)
                           .json(new ApiError(500,"Something went wrong while deleting User Post",error))
                    }
})

export {
       createPost,
       getUserPost,
       updateUserPost,
       deleteUserPost,


}