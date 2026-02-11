import Like from "../models/like.model.js"
import User from "../models/user.model.js";

const toggleLike=async({filter,userId})=>{
               const existingLike= await Like.findOne({
                    ...filter,
                    likedBy:userId
                })

      let liked;
                if(existingLike)
                {
                   const deletedLike=await Like.findOneAndDelete(existingLike._id);
                   console.log("deletedLike:",deletedLike)
                   liked=false;
                }
                else{
                     const newCreateLike=await Like.create({
                                  ...filter,
                                  likedBy:userId
              })
                console.log("New Create Like:",newCreateLike)
                
                liked=true;
                }
              const totalLikes= await Like.countDocuments(filter)
              console.log("Total Likes:",totalLikes) 
              const user=await User.findById(userId)            

              return {
                liked,
                totalLikes,
                likedBy:liked ? user.username :null
                }


}
export {
    toggleLike
}
