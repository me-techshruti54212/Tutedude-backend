const mongoose=require("mongoose")

const connectDb=async()=>{
    
    await mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("database connected")).catch((err)=>console.log(err))
    
}

module.exports={connectDb}
