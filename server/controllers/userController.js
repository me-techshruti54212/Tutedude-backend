const { userModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
// const axios = require("axios");
// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: "Username doesn't exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    const token = createToken(user._id);
    res.json({
      success: true,
      token,userId:user._id,
      message: "You have been loggedIn successfully.",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error in login occured" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET);
};

// Register User
const registerUser = async (req, res) =>
{
  const { username,email , password } = req.body;
  try {
    const userexists = await userModel.findOne({username});
    const emailexists=await userModel.findOne({email});
   
    if (userexists) {
      return res.json({ success: false, message: "Username already exists" });
    } 
   else if (emailexists) {
      return res.json({ success: false, message: "This email is already registered" });
    } 
    else {
    
      // hashing user pwd
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new userModel({
       username,email,
        password: hashedPassword,
      });
      const user = await newUser.save();
     
      const token=createToken(user._id)
      res.json({success:true,token,message:"You have been successfully registered."});
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Some error occured", success: false });
  }
};

const getallUsers=async(req,res)=>{
  try{
  const allUsers=await userModel.find({});
    res.json({success:true,users:allUsers,message:"All users obtained"})
  }
  catch(err)
  {
    res.json({success:false,message:"Error in displaying all users"})
  }
}
const sendfriendRequest=async(req,res)=>{
  const { userId, friendId } = req.body;
  try{
    const friend = await userModel.findById(friendId);

    if (!friend.friendRequests.includes(userId)) {
      friend.friendRequests.push(userId);
      await friend.save();
    }
  
    res.json({ message: 'Friend request sent',success:true });
  }
  catch(err)
  {
    res.json({success:false,message:"Something went wrong"})
  }
 
}
const acceptfriendRequest=async(req,res)=>{
  const { userId, friendId} = req.body; 
  try{
    const user = await userModel.findById(userId);
    const friend = await userModel.findById(friendId)
    if(!user.friends.includes(friendId))
     { user.friends.push(friendId);
      
      await user.save();
  
     }
     if(user.friendRequests.includes(friendId))
      {
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId.toString() );

      await user.save()
      }
    
     if(!friend.friends.includes(userId))
      {friend.friends.push(userId);
      await friend.save();}
      res.json({message:"Request accepted",success:true})
  
  }
  catch(err)
  {
    res.json({message:"Something went wrong",success:false})

  }
 }
const rejectfriendRequest=async(req,res)=>{
const {userId,friendId}=req.body;
try{
  const user = await userModel.findById(userId);
  user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId.toString());
  await user.save();
  res.json({success:true,message:"Friend request rejected"})
}
catch(err)
{
  res.json({success:false,message:"Error occured"})
}

}
const unfriend=async(req,res)=>{
const {userId,friendId}=req.body;
try{
  const user = await userModel.findById(userId);
  const friend=await userModel.findById(friendId);
  if(user.friends.includes(friendId))
  {
    user.friends=user.friends.filter(id=>id.toString()!==friendId.toString());
    await user.save();
  }
  if(friend.friends.includes(userId))
  {
    friend.friends=friend.friends.filter(id=>id.toString()!==userId.toString());
    await friend.save();
  }
  res.json({message:"Unfriend" ,success:true})
}
catch(err)
{
  res.json({success:false,message:"Error occured"})
}

}
const getFriendsList=async(req,res)=>{
  const {userId}=req.body;
  try{
    const user = await userModel.findById(userId).populate('friends');
    res.json({success:true,friends:user.friends ,message:"Friends list obtained"})
  }
 catch(err)
 {
  res.json({success:false,message:"Error"})

 }

}
const recommendations=async(req,res)=>
  {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    console.log(user)
    const allUsers = await userModel.find({ _id: { $ne: userId } });
    console.log(allUsers)
    const recommended = allUsers.filter(otherUser =>
     { return otherUser.friends.some(friend => user.friends.includes(friend))  }
    );
    const recommendations=recommended.filter((one)=>!user.friends.includes(one._id))
  
    res.json({recommendations:recommendations,success:true});
}
const getFriendRequests=async(req,res)=>{
  try{
    const {userId}=req.body;
    const user = await userModel.findById(userId).populate('friendRequests');
    res.json({success:true,friendRequests:user.friendRequests ,message:"FriendRequests obtained"})


  }
  catch(err)
  {
    res.json({message:"Error occured",success:false})
  }
}
module.exports = { loginUser, registerUser,getallUsers ,sendfriendRequest,acceptfriendRequest, rejectfriendRequest,unfriend,recommendations,getFriendsList,getFriendRequests};
