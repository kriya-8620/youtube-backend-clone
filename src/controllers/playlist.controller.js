import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import mongoose from "mongoose";

import ApiResponse from "../utils/ApiResponse.js";
import Playlist from "../models/playlist.model.js";

import {requireBodyFields} from "../middlewares/validator.js";

const createPlaylist=asyncHandler(async(req,res)=>{

        try{
             requireBodyFields("name","description");
             const {name,description}=req.body;
             const playlistData= await Playlist.create({
                                                     name,
                                                     description,
                                                     owner:req.user._id,
                                    });

            console.log("Playlist:",playlistData)

            res.status(200)
               .json(new ApiResponse(200,playlistData,"Playlist Created Successfully"))

        }catch(error){
                    res.status(500)
                    .json(new ApiError(500,"Something went wrong while creating Playlist",error))
                }

})

const addVideoToPlaylist=asyncHandler(async(req,res)=>{

            try{
                const {playlistId,videoId}=req.params;

                const playlistUpdateData = await Playlist.findByIdAndUpdate(playlistId,
                                                { $addToSet: { videos: videoId } },   // adds only if not already present
                                                { new: true }
);                                                           


                console.log("Playlist Data",playlistUpdateData);
                    
                
                return res.status(200)
                          .json(new ApiResponse(200,playlistUpdateData,"Video Successfully added to the Playlist"))
                
            }catch(error)
            {
                   return res.status(500)
                   .json(new ApiError(500,"Something Went Wrong while adding video to Playlist",error))
            }
})

const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{
       try{
             const {playlistId,videoId}=req.params;
             const deletedVideo=await Playlist.findByIdAndUpdate(
                    playlistId,
                    {
                        $pull:{
                            videos:videoId,
                        }
                    }
                )
                console.log("deletedVideo",deletedVideo)

        return res.status(200)
                  .json(new ApiResponse(200,deletedVideo,"Video deleted successfully"))

       }catch(error)
       {
        console.log("Error while deleting video from playlist",error)
        return res.status(500)
                  .json(new ApiError(500,"Something went wrong while deleting video",error))
       }
})

const deletePlaylist=asyncHandler(async(req,res)=>{
    try{
        const {playlistId}=req.params;

        const deletePlaylist=await Playlist.findByIdAndDelete(playlistId);
        console.log(deletePlaylist)

        return res.status(200)
                  .json(new ApiResponse(200,deletePlaylist,"Playlist deleted successfully"))
    }catch(error)
    {
        console.log("Error while deleting the Playlist:",error)
        return res.status(500)
                  .json(new ApiError(500,"Something went wrong while deleting Playlist",error))
    }
})

const updatePlaylist=asyncHandler(async(req,res)=>{
    try{
           const {playlistId}=req.params;
           const {name,description}=req.body;
          if( ![name,description].some(field=>!field || field?.trim()==="") )
             {
                     throw new ApiError(400, "At least one field is required");
             }
          
       const update = {};
                  if (name?.trim()) update.name = name;
                  if (description?.trim()) update.description = description;

                   const updatedPlaylist = await Playlist.findByIdAndUpdate(
                                playlistId,
                               { $set: update },
                               { new: true }
);

        if (!updatedPlaylist) {
                   throw new ApiError(404, "Playlist not found");
                     }
                  

        return res.status(200)
                  .json(new ApiResponse(200,updatedPlaylist,"Playlist Updated successfully"))

    }catch(error)
    {
        console.log("Error while updating Playlist:",error)
        return res.status(500)
                  .json(new ApiError(500,"Something went wrong while updating Playlist",error))
    }
})

const getUserPlaylist=asyncHandler(async(req,res)=>{
    try{
         const {userId}=req.params;
         const userPlaylistDetails = await Playlist.aggregate([
{
    $match: {
      owner: new mongoose.Types.ObjectId(userId)
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $lookup: {
      from: "videos",
      localField: "videos",
      foreignField: "_id",
      as: "videos"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $project: {
      name: 1,
      description: 1,
      "user.username": 1,
      videos: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1
      }
    }
  }
]);

if(! userPlaylistDetails)
{
    throw new ApiError(400,"User Playlist not found")
}
                            
console.log("Playlist Details:",userPlaylistDetails)


         


        res.status(200)
           .json(new ApiResponse(200,userPlaylistDetails,"Fetched User Playlist Successfully"))
    }catch(error)
    {
        console.log("Something went wrong while fetching User Playlist Details:",error)
        return res.status(500)
                  .json(new ApiError(500,"Something went wrong while fetching User Playlist:",error))
    }

})



export{
      createPlaylist,   
      addVideoToPlaylist,
      removeVideoFromPlaylist,
      deletePlaylist,
      updatePlaylist,
      getUserPlaylist,

    
}