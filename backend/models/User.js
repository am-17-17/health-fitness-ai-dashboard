import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
            
        },

        email: {
            type: String,
            required: true,
            unique:true    // no duplicate emails allowed
        },

        password: {
            type: String,
            
        },

        provider: {
            type: String,
            enum: ["local", "google"],
            default:"local"
        }

    },

    {
        timestamps: true  // automatically adds createdAt & updateAt
        
    }

);

// Create User model from Schema 
const User = mongoose.model("User", userSchema);

// Export model
export default User;