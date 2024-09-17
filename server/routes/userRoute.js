const express=require("express")
const {loginUser,registerUser,getallUsers,sendfriendRequest,acceptfriendRequest,rejectfriendRequest,recommendations, unfriend,getFriendsList,getFriendRequests}=require("../controllers/userController")
const userRouter=express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/getallUsers",getallUsers)
userRouter.post("/sendfriendRequest",sendfriendRequest)
userRouter.post("/acceptfriendRequest",acceptfriendRequest)
userRouter.post("/rejectfriendRequest",rejectfriendRequest)
userRouter.post("/unfriend",unfriend)
userRouter.post("/getFriendsList",getFriendsList)
userRouter.post("/recommendations",recommendations)
userRouter.post("/getFriendRequests",getFriendRequests)
module.exports=userRouter
