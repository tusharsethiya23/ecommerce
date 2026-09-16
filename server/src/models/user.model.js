import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {

        name: {
            required:true,
            type:String
        },
        email:{
            type:String,
            unique:true,
            required:true
        },
        password:{
            type:String,
            required:true,
            select:false
        },
        role:{
            type:String,
            enum:["user", "seller"],
            default:"user"
        }

    }

)

const userModel = mongoose.model("user", userSchema)

export default userModel