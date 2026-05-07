const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");


const bcrypt = require("bcryptjs")
/**
 * - user register controller
 * - route /api/auth/register
 */
async function userRegisterController(req,res){
    const {username , email , password} = req.body;

    const isUserExist = await userModel.findOne({email:email});
    if(isUserExist){
      return res.status(422).json({
        message:"Email already exists",
        status:"failed"
      })
    };

    const user = await userModel.create({
      username,email, password
    });

    const token = jwt.sign({
        userID:user._id,
        email
    },process.env.JWT_SCERET,{
      expiresIn:"3d"
    });

    res.cookie("token",token)
    res.status(201).json({
      user:{
           _id:user._id,
           email:user.email,
           username:user.username
      },
      message:"user registered successfully",
      status:"passed",
      token
    })

}

/**
 * - user login controller
 * - route /api/auth/login
 */

async function userLoginController(req,res){
  const {email,password} = req.body;

  const user = await userModel.findOne({email:email}).select("+password");
  if(!user){
    return res.status(401).json({
      message:"user doesn't exits with this email",
      status:"failed"
    })
  }

  const isPasswordCorrect =  await user.comparePassword(password);

  if(!isPasswordCorrect){
    return res.status(401).json({
      message:"Incorrect password",
      status:"failed"
    })
  }

  const token = jwt.sign({
    email:user.email
  },process.env.JWT_SCERET,{expiresIn:"3d"});

  res.cookie("token",token);
  res.status(200).json({
    user:{
           _id:user._id,
           email:user.email,
           username:user.username
      },
    message:"User logged In successfully",
    status:"pass",
    token
  })
}

module.exports = {
  userRegisterController,
  userLoginController
}