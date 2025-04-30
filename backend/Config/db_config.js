const mongoose =require("mongoose")

const DBconnect=async()=>{
    try {
         const cnn =await mongoose.connect(process.env.MONGO_URI)
         console.log("DBconnect".green,cnn.connection.host);
    } catch (error) {
        console.log(error);
    }
}
//summy

module.exports ={DBconnect}
