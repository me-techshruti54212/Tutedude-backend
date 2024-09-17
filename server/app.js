const express=require("express")
const cors=require("cors")
const {connectDb}=require("./config/db.js")

const bodyParser=require('body-parser')
// const oauthRouter=require("./routes/oauthRoute.js")
const userRouter=require("./routes/userRoute.js")
// const requestRouter=require("./routes/requestRoute.js")
const dotenv=require("dotenv/config")


const app=express()
app.use("/public",express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(cors())

connectDb()

app.get("/",(req,res)=>res.send("Hello"))

app.use("/api/user",userRouter)

const port=  process.env.PORT || 8000
app.listen(port,()=>{console.log(`Server started at http://localhost:${port}`)})


