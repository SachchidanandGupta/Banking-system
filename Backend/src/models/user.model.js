const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email id required for creating an user"],
      trim: true,
      lowercase: true,
      match: [
        /\S+@\S+\.\S+/,
        "please provid a valid email id",
      ],
      unique: [true, "Email already exists"],
    },
    name: {
      type: String,
      required: [true, "name is required for creating an user."],
    },
    password: {
      type: String,
      required: [true, "password is required for creating an account"],
      minlength: [6, "password must contain atleast 6 character"],
      select: false,
    },
  },
  {
    timestamps: true,
  });
userSchema.pre("save", async function () {
    if(!this.isModified("password")){
     return ;
    } 
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
    return ;
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
