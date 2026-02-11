import mongoose from "mongoose";
import  ApiError  from "../utils/ApiError.js";

 const validateObjectId = (...paramName) => {
  return (req, res, next) => {
    for(const param of paramName)
    {
      
       if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
            throw new ApiError(400, `Invalid ${param}`);
    }

    }

   
    next();
  };
};

const requireBodyFields = (...fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (!req.body[field]?.trim()) {
        throw new ApiError(400, `${field} is required`);
      }
    }
    next();
  };
};




export{
       validateObjectId,
       requireBodyFields,
       

}