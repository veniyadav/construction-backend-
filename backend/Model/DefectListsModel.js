const mongoose =require("mongoose")


const DefectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    project:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    assigned:{
        type:String,
        required:true,
    },
    priority:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    date:{  
        type:Date,
        required:true,
    },
    image: [String],
    comments:{
        type:String,
        required:true,
    },
},{
    timestamps:true,
})

module.exports = mongoose.model('Defect',DefectSchema)