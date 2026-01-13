import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import Video from "../models/video.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const publishAvideo=asyncHandler(async(req,res)=>{
try{
const {title,description}= req.body;

    console.log("Body Data",req.body);
   // Check if all fields not empty
    if(
        [title,description].some((field)=>{
            return !field || field.trim() === ""
        })

    ){
        throw new ApiError(400,"All fields are required")
    }

     // Check if user exists

     const user= await User.findById(req.user);

     if(!user)
     {
        throw new ApiError(404,"User Not Found")
     }
    console.log("Request Video File:",req.files)

    const videoLocalPath=req.files?.video[0]?.path;
    const thumbnailLocalPath=req.files?.thumbnail[0]?.path;

    if( !(videoLocalPath && thumbnailLocalPath))
    {
      throw new ApiError(404,"Video and Thumbnail both are required")
    }
    
    const video = await uploadCloudinary(videoLocalPath);
    const thumbnail = await uploadCloudinary(thumbnailLocalPath);

    if( !(video && thumbnail))
    {
        throw new ApiError(400,"Video and Thumbnail both are required")
    }
   console.log("Video:",video);
   console.log("Thumbnail:",thumbnail);

   const videoData= await Video.create({
                    title,
                    description,
                    owner:req.user,
                    videoFile:video?.secure_url,
                    thumbnail:thumbnail?.secure_url,
                    duration:video?.duration,
                    videoPublicId:video?.public_id,
                    thumbnailPublicId:thumbnail?.public_id,
   })

   if(!videoData)
   {
    new ApiError(500,"Something Went wrong while upload the Video Data")
   }

   return res.status(200).json(
       new ApiResponse(200,videoData,"Video File Uploaded Successfully")
   )
         

}catch(error)
{
   return res.status(500).json(
          new ApiError(500,"Something went wrong while uploading video file")
   ) 
}
    
         
})

const getVideoById=asyncHandler(async(req,res)=>{

    try{
       /*const video = await Video.find({owner:req.user._id})
       console.log("Fetched Video:",video)*/

       const video = await Video.aggregate([
  {
    $match: {
      owner: new mongoose.Types.ObjectId(req.user._id),
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner",
    },
  },
  {
    $project: {
      // ✅ keep ALL Video fields
      title: 1,
      description: 1,
      videoFile: 1,
      thumbnail: 1,
      duration:1,
      views:1,
      isPublished:1,
      createdAt: 1,
      updatedAt: 1,

      // ✅ only username from User
      "owner.username": 1,
      "owner.fullname":1,
    },
  },
  {
    $unwind: "$owner",
  },
]);

       
       
       console.log("Video Data:",video)

       
       return res.status(200)
              .json(new ApiResponse(200,video,"Video Fetched Successfully"))


    }catch(error)
    {
      return res.status(500)
             .json(new ApiError(500,"Something went wrong"))
    }
    

    
})

const updateVideoById=asyncHandler(async(req,res)=>{
    try{

    const {videoId}=req.params;
    const videoData=await Video.findById(videoId)
    const updateData={};
    
    const fields = ["title", "description"];

   fields.forEach((field) => {
    if (req.body[field] !== undefined) {
    if (typeof req.body[field] === "string" && !req.body[field].trim()) {
      throw new Error(`${field} cannot be empty`);
    }
    updateData[field] = req.body[field];
  }
  });

  

    const videoLocalPath=req.files?.video[0]?.path;
    const thumbnailLocalPath=req.files?.thumbnail[0]?.path;
    if(videoLocalPath)
    {
       const updatedVideo=await uploadCloudinary(videoLocalPath);
       if(! updatedVideo)
       {
        throw new ApiError(404,"Video File is required to update")
       }
       updateData.videoFile=updatedVideo?.secure_url;
       updateData.videoPublicId=updatedVideo?.public_id;

       console.log("Updated Video",updatedVideo)
    }

    if(thumbnailLocalPath)
    {
       const updatedThumbnail=await uploadCloudinary(thumbnailLocalPath);
       if(! updatedThumbnail)
       {
        throw new ApiError(404,"Video File is required to update")
       }
       updateData.thumbnail=updatedThumbnail?.secure_url;
       updateData.thumbnailPublicId=updatedThumbnail?.public_id;

       console.log("Updated Thumbnail:",updatedThumbnail)
    }
    

     // ---------------- UPDATE DB ----------------
  const updatedVideoData=await Video.findByIdAndUpdate(videoId,
    {
        $set:updateData
    },
    {
        new:true
    }
  )

  console.log("Video Public ID:",updateData.videoPublicId,videoData.videoPublicId)

  // ---------------- DELETE OLD FILE ----------------
  if (updateData.videoPublicId && videoData.videoPublicId) {

    const deletedVideo=await cloudinary.uploader.destroy(
    videoData.videoPublicId,
   { resource_type: "video" }
);
  console.log("Deleted Video:",deletedVideo)
  }

  if (updateData.thumbnailPublicId && videoData.thumbnailPublicId) {

     const deletedThumbnail=await cloudinary.uploader.destroy(
     videoData.thumbnailPublicId,
   { resource_type: "image" }
);
console.log("New Upload Thumbnail:",deletedThumbnail)
  }


 res.status(200)
       .json(new ApiResponse(200,updatedVideoData,"Video Data Updated Successfully"))
    }catch(error)
    {
        console.log("Error While Deleting Old Video:",error)
            res.status(500)
           .json(new ApiError(500,error))
    }
    


})

const getAllVideos=asyncHandler(async(req,res)=>{
               try{
                   const page = parseInt(req.query.page) || 1;
                   const limit= parseInt(req.query.limit) || 5;

                   const totalVideos=await Video.countDocuments();
                   const skip=(page-1)*limit;

                   const videos=await Video.find()
                         .select("-videoPublicId -thumbnailPublicId")
                         .populate("owner","username fullname -_id")
                         .sort({createdAt:-1})
                         .skip(skip)
                         .limit(limit)

                  console.log(videos);
                  const resData={
                                page,
                                limit,
                                totalVideos,
                                totalPages:Math.ceil(totalVideos/limit),
                                videos,
                                }
                  res.status(200)
                     .json(new ApiResponse(200,resData,"Video Fetched Successfully"))


               }catch(error)
               {
                console.log("Error While doing Pagination:",error);
               }
                   
})
export{

    publishAvideo,
    getVideoById,
    updateVideoById,
    getAllVideos,
}