import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema=new mongoose.Schema({
                   comment:{
                           type:mongoose.Schema.Types.ObjectId,
                           ref:"Comment",
                           },  
                   video:{
                           type:mongoose.Schema.Types.ObjectId,
                           ref:"Video",
                           }, 
                   post:{
                           type:mongoose.Schema.Types.ObjectId,
                           ref:"Post",
                           },  
                   likedBy:{
                           type:mongoose.Schema.Types.ObjectId,
                           ref:"User",
                           required:true,
                           },           
    
},{timestamps:true})


// Prevent duplicate values 
likeSchema.index(
    {comment:1,video:1,post:1,likedBy:1},
    {unique:true,sparse:true}
);

likeSchema.plugin(mongooseAggregatePaginate);
const Like= mongoose.model("Like",likeSchema);

export default Like;