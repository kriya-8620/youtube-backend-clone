import dotenv from "dotenv"


/*import express from "express";
const app=express();*/
import {app} from "./app.js"

import connectDB from './db/index.js';

dotenv.config({
    path:"./env"
})
connectDB()
.then((resolve)=>{

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Application is running on PORT ${process.env.PORT}`)

    })
})

.catch((err)=>{
    console.log(`MongoDB connection failed`,err);
})

