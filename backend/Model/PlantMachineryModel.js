const mongoose =require("mongoose")

const PlantMachinerySchema = new mongoose.Schema({
    toolID:{
        type:String,
        required:true,
    },  
    name:{
        type:String,
        required:true,
    },
    manufacturer:{
        type:String,
        required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true,
    },
    purchaseDate:{
        type:Date,
        required:true,
    },
    condition:{
        type:String,
        required:true,
    },
    notes:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },  
  }, {
    timestamps: true,
  });
  

  
module.exports = mongoose.model('PlantMachinery',PlantMachinerySchema)
