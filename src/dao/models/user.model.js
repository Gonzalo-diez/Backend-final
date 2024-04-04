import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    roles: String,
});

const User = mongoose.model("User", userSchema);

export default User;