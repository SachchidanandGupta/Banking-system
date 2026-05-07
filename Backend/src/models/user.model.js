const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:[true,"Email is required for creating an user"],
    unique:[true,"email already exists, please login"],
    trim:true,
    match:[/\S+@\S+\.\S+/,"Inavlid Email"],
    lowercase:true
  },
  username:{
    type:String,
    required:[true,"Username is needed to create an account"]
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    minlength:[6,"password must contain atleast 6 characters"],
    select:false // this ensures that the password isn't been returned on frontend at all
  }
},{
  timestamps:true
});

userSchema.pre("save",async function(){
  if(!this.isModified("password")){
    return;
  }
  const hash = await bcrypt.hash(this.password,10);
  this.password = hash;
  return;
})

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password);
}

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;