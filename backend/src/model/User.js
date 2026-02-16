import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            unique: true,
            trim: true,
            required: true,
            lowercase: true,
        },
        password:{
            type:String,
            required:true
        },
        
        mobileno: {
            type: Number,
            unique: true,
            required: true,
        },
  
        role: {
            type: String,
            enum: ["citizen", "ngo","admin"],
            default: "citizen",
        },
        isBlacklisted: {
            type: Boolean,
            default: false
        },
         address: {
        latitude: Number,
        longitude: Number,
        },
        image: {
            type: String, 
        },
        regiid: {
            type: String,
            required: false,
            default: null,
            },

            aboutus: {
            type: String,
            required: false,
            default: "",
            },

            mission: {
            type: String,
            required: false,
            default: "",
            },

            otp: {
                type: String
            },
            otpExpiry: {
                type: Date
            }


    },
    {timestamps:true}
);
// export default mongoose.model("User",userSchema);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
